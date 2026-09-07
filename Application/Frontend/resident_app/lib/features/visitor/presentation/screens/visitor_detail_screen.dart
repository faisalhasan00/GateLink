import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../widgets/visitor_detail_header.dart';
import '../widgets/visitor_info_card.dart';
import '../widgets/visitor_timeline_widget.dart';
import '../widgets/visitor_qr_pass_card.dart';

class VisitorDetailScreen extends ConsumerWidget {
  final String visitorId;
  const VisitorDetailScreen({super.key, required this.visitorId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitor Details'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      body: visitorsAsync.when(
        data: (visitors) {
          final matchingVisitors =
              visitors.where((v) => v.id == visitorId).toList();
          if (matchingVisitors.isEmpty) {
            return const Center(
              child: Text(
                'Visitor details not found or removed.',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            );
          }

          final visitor = matchingVisitors.first;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              children: [
                VisitorDetailHeader(visitor: visitor),
                const SizedBox(height: AppSpacing.md),
                VisitorInfoCard(visitor: visitor),
                const SizedBox(height: AppSpacing.md),
                VisitorTimelineWidget(visitor: visitor),
                if (visitor.isApproved || visitor.isExpected) ...[
                  const SizedBox(height: AppSpacing.md),
                  VisitorQrPassCard(visitorId: visitorId),
                ],
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
