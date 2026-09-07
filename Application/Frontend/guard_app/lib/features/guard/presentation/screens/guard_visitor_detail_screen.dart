import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../widgets/guard_visitor_header_card.dart';
import '../widgets/guard_visitor_info_table.dart';
import '../widgets/guard_visitor_timeline_card.dart';
import '../widgets/guard_visitor_actions_bar.dart';

class GuardVisitorDetailScreen extends ConsumerWidget {
  final String visitorId;
  const GuardVisitorDetailScreen({super.key, required this.visitorId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitor Gate Details'),
        backgroundColor: AppColors.secondary,
        foregroundColor: Colors.white,
      ),
      body: visitorsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
        data: (snapshot) {
          final matchingDocs = snapshot.docs.where((d) => d.id == visitorId).toList();
          if (matchingDocs.isEmpty) {
            return const Center(
              child: Text('Visitor details not found or removed.', style: TextStyle(color: AppColors.textSecondary)),
            );
          }

          final doc = matchingDocs.first;
          final data = doc.data() as Map<String, dynamic>;
          final name = data['name'] ?? 'Unknown Visitor';
          final phone = data['phone'] ?? 'N/A';
          final status = data['status'] ?? 'pending';
          final company = data['company'] ?? '';
          final photoUrl = data['photoUrl'] as String?;

          final isInside = status == 'inside';
          final isPending = status == 'pending';
          final isApproved = status == 'approved';
          final isRejected = status == 'rejected' || status == 'denied';

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              children: [
                GuardVisitorHeaderCard(
                  name: name,
                  company: company,
                  status: status,
                  photoUrl: photoUrl,
                  isInside: isInside,
                  isApproved: isApproved,
                  isRejected: isRejected,
                ),
                const SizedBox(height: AppSpacing.lg),
                GuardVisitorInfoTable(data: data),
                const SizedBox(height: AppSpacing.lg),
                GuardVisitorTimelineCard(
                  data: data,
                  isApproved: isApproved,
                  isInside: isInside,
                  isRejected: isRejected,
                ),
                const SizedBox(height: AppSpacing.xl),
                GuardVisitorActionsBar(
                  docId: doc.id,
                  phone: phone,
                  isInside: isInside,
                  isPending: isPending,
                  isApproved: isApproved,
                  ref: ref,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
