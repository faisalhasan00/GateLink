import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/complaint_model.dart';
import '../../providers/complaint_providers.dart';

class ComplaintDetailScreen extends ConsumerStatefulWidget {
  final String complaintId;
  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  ConsumerState<ComplaintDetailScreen> createState() =>
      _ComplaintDetailScreenState();
}

class _ComplaintDetailScreenState
    extends ConsumerState<ComplaintDetailScreen> {
  int _selectedRating = 5;
  final _feedbackController = TextEditingController();
  final Set<String> _selectedFeedbackTags = {};
  bool _submittingRating = false;

  final List<String> _quickTags = [
    '⚡ Quick Response',
    '🛠️ Professional Work',
    '😊 Polite Staff',
    '✨ Issue Fully Fixed',
    '🧹 Clean & Neat',
  ];

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  Future<void> _submitRating(String societyId) async {
    HapticFeedback.mediumImpact();
    setState(() => _submittingRating = true);

    try {
      final repository = ref.read(complaintRepositoryProvider);
      final combinedFeedback = [
        if (_selectedFeedbackTags.isNotEmpty)
          _selectedFeedbackTags.join(', '),
        if (_feedbackController.text.trim().isNotEmpty)
          _feedbackController.text.trim(),
      ].join(' — ');

      await repository.submitRating(
        societyId: societyId,
        complaintId: widget.complaintId,
        rating: _selectedRating,
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
                // ── 1. TICKET HEADER & SUMMARY CARD ──────────────────────────
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEFF6FF),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                  color: const Color(0xFFBFDBFE)),
                            ),
                            child: Text(
                              complaint.category.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1D4ED8),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: complaint.priority.toLowerCase() == 'high'
                                  ? const Color(0xFFFEE2E2)
                                  : const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: complaint.priority.toLowerCase() == 'high'
                                    ? const Color(0xFFFECACA)
                                    : const Color(0xFFFDE68A),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.flag_rounded,
                                  size: 12,
                                  color: complaint.priority.toLowerCase() ==
                                          'high'
                                      ? const Color(0xFFDC2626)
                                      : const Color(0xFFD97706),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${complaint.priority.toUpperCase()} PRIORITY',
                                  style: TextStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w800,
                                    color: complaint.priority.toLowerCase() ==
                                            'high'
                                        ? const Color(0xFFDC2626)
                                        : const Color(0xFFD97706),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        complaint.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            complaint.ticketNumber,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF64748B),
                            ),
                          ),
                          const Text(' • ',
                              style: TextStyle(color: Color(0xFF94A3B8))),
                          Text(
                            _formatDate(complaint.createdAt),
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // ── 2. VISUAL 4-STEP PROGRESS STEPPER ────────────────────────
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'RESOLUTION PROGRESS',
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildProgressStepper(currentStep, complaint),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // ── 3. ASSIGNED TECHNICIAN / STAFF CARD ──────────────────────
                if (hasAssignedStaff) ...[
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFBBF7D0)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: const BoxDecoration(
                            color: Color(0xFF16A34A),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.engineering_rounded,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'ASSIGNED TECHNICIAN',
                                style: TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF15803D),
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 1),
                              Text(
                                complaint.assignedTo!,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              Text(
                                'Society ${complaint.category} Maintenance Staff',
                                style: const TextStyle(
                                  fontSize: 11.5,
                                  color: Color(0xFF4B5563),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],

                // ── 4. RESIDENT SATISFACTION & RATING CARD ───────────────────
                if (complaint.isResolved) ...[
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: complaint.rating != null
                            ? const Color(0xFF86EFAC)
                            : const Color(0xFFFDE68A),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF59E0B)
                              .withValues(alpha: 0.08),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.star_rounded,
                              color: Color(0xFFF59E0B),
                              size: 22,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              complaint.rating != null
                                  ? 'YOUR RESOLUTION RATING'
                                  : 'RATE TECHNICIAN & RESOLUTION',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.6,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const Spacer(),
                            if (complaint.rating != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDCFCE7),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  '✓ Rated',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF15803D),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        if (complaint.rating != null) ...[
                          Row(
                            children: List.generate(
                              5,
                              (i) => Icon(
                                Icons.star_rounded,
                                color: i < complaint.rating!
                                    ? const Color(0xFFF59E0B)
                                    : const Color(0xFFCBD5E1),
                                size: 26,
                              ),
                            ),
                          ),
                          if (complaint.ratingFeedback != null &&
                              complaint.ratingFeedback!.isNotEmpty) ...[
                            const SizedBox(height: 8),
                            Text(
                              '"${complaint.ratingFeedback}"',
                              style: const TextStyle(
                                fontSize: 13,
                                fontStyle: FontStyle.italic,
                                color: Color(0xFF475569),
                              ),
                            ),
                          ],
                        ] else ...[
                          const Text(
                            'How satisfied are you with the resolution of this issue?',
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFF475569),
                            ),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: List.generate(
                              5,
                              (i) => IconButton(
                                icon: Icon(
                                  Icons.star_rounded,
                                  color: i < _selectedRating
                                      ? const Color(0xFFF59E0B)
                                      : const Color(0xFFCBD5E1),
                                  size: 32,
                                ),
                                onPressed: () {
                                  HapticFeedback.selectionClick();
                                  setState(() => _selectedRating = i + 1);
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: _quickTags.map((tag) {
                              final isSelected =
                                  _selectedFeedbackTags.contains(tag);
                              return FilterChip(
                                label: Text(tag),
                                selected: isSelected,
                                onSelected: (sel) {
                                  HapticFeedback.selectionClick();
                                  setState(() {
                                    if (sel) {
                                      _selectedFeedbackTags.add(tag);
                                    } else {
                                      _selectedFeedbackTags.remove(tag);
                                    }
                                  });
                                },
                                selectedColor: const Color(0xFFFEF3C7),
                                labelStyle: TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w700,
                                  color: isSelected
                                      ? const Color(0xFF92400E)
                                      : const Color(0xFF334155),
                                ),
                                backgroundColor: const Color(0xFFF8FAFC),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  side: BorderSide(
                                    color: isSelected
                                        ? const Color(0xFFF59E0B)
                                        : const Color(0xFFE2E8F0),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            height: 42,
                            child: ElevatedButton(
                              onPressed: _submittingRating
                                  ? null
                                  : () => _submitRating(societyId),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF1E3A8A),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                elevation: 0,
                              ),
                              child: _submittingRating
                                  ? const SizedBox(
                                      height: 18,
                                      width: 18,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const Text(
                                      'Submit Feedback',
                                      style: TextStyle(
                                          fontWeight: FontWeight.w800,
                                          fontSize: 14),
                                    ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],

                // ── 5. COMPLAINT DESCRIPTION & PHOTO PROOF ───────────────────
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'ISSUE DESCRIPTION',
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        complaint.description.isNotEmpty
                            ? complaint.description
                            : 'No detailed description provided.',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF334155),
                          height: 1.45,
                        ),
                      ),
                      if (complaint.photoUrl != null &&
                          complaint.photoUrl!.isNotEmpty) ...[
                        const SizedBox(height: 16),
                        const Text(
                          'ATTACHED PHOTO PROOF',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                            color: Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            complaint.photoUrl!,
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              height: 120,
                              color: const Color(0xFFF1F5F9),
                              child: const Center(
                                child: Icon(
                                  Icons.broken_image_rounded,
                                  color: Color(0xFF94A3B8),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
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

  Widget _buildProgressStepper(int currentStep, ComplaintModel complaint) {
    final steps = [
      {'title': 'Ticket Raised', 'desc': _formatDate(complaint.createdAt)},
      {
        'title': 'Assigned',
        'desc': complaint.assignedTo != null
            ? 'Assigned to ${complaint.assignedTo}'
            : 'Pending assignment'
      },
      {'title': 'In Progress', 'desc': 'Technician working on-site'},
      {'title': 'Resolved', 'desc': 'Fixed & verified'},
    ];

    return Column(
      children: List.generate(steps.length, (index) {
        final isCompleted = index < currentStep;
        final isCurrent = index == currentStep;
        final isPending = index > currentStep;
        final isLast = index == steps.length - 1;

        Color dotColor;
        Color lineColor;

        if (isCompleted || isCurrent) {
          dotColor = isCompleted
              ? const Color(0xFF10B981) // Emerald check
              : (currentStep == 3
                  ? const Color(0xFF10B981)
                  : const Color(0xFF1E3A8A));
          lineColor = isCompleted
              ? const Color(0xFF10B981)
              : const Color(0xFFE2E8F0);
        } else {
          dotColor = const Color(0xFFCBD5E1);
          lineColor = const Color(0xFFE2E8F0);
        }

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: isCompleted
                        ? const Color(0xFF10B981)
                        : isCurrent
                            ? dotColor
                            : Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: dotColor,
                      width: 2,
                    ),
                  ),
                  child: Center(
                    child: isCompleted
                        ? const Icon(Icons.check_rounded,
                            size: 14, color: Colors.white)
                        : isCurrent
                            ? Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                ),
                              )
                            : null,
                  ),
                ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: 36,
                    color: lineColor,
                  ),
              ],
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      steps[index]['title']!,
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: isCurrent || isCompleted
                            ? FontWeight.w800
                            : FontWeight.w600,
                        color: isPending
                            ? const Color(0xFF94A3B8)
                            : const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      steps[index]['desc']!,
                      style: TextStyle(
                        fontSize: 11.5,
                        color: isPending
                            ? const Color(0xFFCBD5E1)
                            : const Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
