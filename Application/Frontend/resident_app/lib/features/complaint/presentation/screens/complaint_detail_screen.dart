import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/complaint_providers.dart';
import '../widgets/complaint_description_card.dart';
import '../widgets/complaint_progress_stepper.dart';
import '../widgets/complaint_rating_card.dart';
import '../widgets/complaint_summary_header.dart';
import '../widgets/complaint_technician_card.dart';

class ComplaintDetailScreen extends ConsumerStatefulWidget {
  final String complaintId;
  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  ConsumerState<ComplaintDetailScreen> createState() =>
      _ComplaintDetailScreenState();
}

class _ComplaintDetailScreenState extends ConsumerState<ComplaintDetailScreen> {
  bool _submittingRating = false;

  Future<void> _submitRating({
    required String societyId,
    required int rating,
    required Set<String> tags,
    required String comment,
  }) async {
    HapticFeedback.mediumImpact();
    setState(() => _submittingRating = true);

    try {
      final repository = ref.read(complaintRepositoryProvider);
      final combinedFeedback = [
        if (tags.isNotEmpty) tags.join(', '),
        if (comment.isNotEmpty) comment,
      ].join(' — ');

      await repository.submitRating(
        societyId: societyId,
        complaintId: widget.complaintId,
        rating: rating,
        feedback: combinedFeedback.isNotEmpty ? combinedFeedback : null,
      );

      if (!mounted) return;
      setState(() => _submittingRating = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('⭐ Thank you! Your rating has been submitted.'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    } catch (e) {
      if (mounted) {
        setState(() => _submittingRating = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to submit rating: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  int _getStepIndex(String status) {
    final s = status.toLowerCase();
    if (s == 'resolved' || s == 'closed' || s == 'completed') return 3;
    if (s == 'in_progress' || s == 'inprogress' || s == 'working') return 2;
    if (s == 'assigned') return 1;
    return 0; // open / raised
  }

  String _formatDate(String isoString) {
    if (isoString.isEmpty) return '';
    try {
      final dt = DateTime.parse(isoString);
      return DateFormat('dd MMM yyyy, hh:mm a').format(dt);
    } catch (_) {
      return isoString;
    }
  }

  @override
  Widget build(BuildContext context) {
    final complaintAsync =
        ref.watch(complaintDetailStreamProvider(widget.complaintId));
    final profile = ref.watch(userProfileProvider).value;
    final societyId = profile?.societyId ?? '';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Complaint Details',
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: const Color(0xFFE2E8F0), height: 1),
        ),
      ),
      body: complaintAsync.when(
        data: (complaint) {
          if (complaint == null) {
            return const Center(
              child: Text(
                'Complaint not found or unavailable.',
                style: TextStyle(color: Color(0xFF64748B)),
              ),
            );
          }

          final currentStep = _getStepIndex(complaint.status);
          final hasAssignedStaff =
              complaint.assignedTo != null && complaint.assignedTo!.isNotEmpty;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ComplaintSummaryHeader(
                  complaint: complaint,
                  formattedDate: _formatDate(complaint.createdAt),
                ),
                const SizedBox(height: AppSpacing.md),
                ComplaintProgressStepper(
                  currentStep: currentStep,
                  complaint: complaint,
                  formatDate: _formatDate,
                ),
                const SizedBox(height: AppSpacing.md),
                if (hasAssignedStaff) ...[
                  ComplaintTechnicianCard(
                    assignedTo: complaint.assignedTo!,
                    category: complaint.category,
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],
                if (complaint.isResolved) ...[
                  ComplaintRatingCard(
                    complaint: complaint,
                    submittingRating: _submittingRating,
                    onSubmitRating: (rating, tags, comment) =>
                        _submitRating(
                      societyId: societyId,
                      rating: rating,
                      tags: tags,
                      comment: comment,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],
                ComplaintDescriptionCard(
                  description: complaint.description,
                  photoUrl: complaint.photoUrl,
                ),
                const SizedBox(height: AppSpacing.xl),
              ],
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: Color(0xFF1E3A8A)),
        ),
        error: (e, _) => Center(
          child: Text(
            'Error: $e',
            style: const TextStyle(color: AppColors.error),
          ),
        ),
      ),
    );
  }
}
