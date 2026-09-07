import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/visitor_detail_actions.dart';
import '../widgets/visitor_detail_header.dart';
import '../widgets/visitor_detail_info_card.dart';
import '../widgets/visitor_detail_timeline.dart';

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
        data: (visitors) {
          final matchingVisitors =
              visitors.where((d) => d.id == visitorId).toList();
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
                const SizedBox(height: AppSpacing.lg),
                VisitorDetailInfoCard(visitor: visitor),
                const SizedBox(height: AppSpacing.lg),
                VisitorDetailTimeline(visitor: visitor),
                const SizedBox(height: AppSpacing.xl),
                VisitorDetailActions(visitor: visitor),
              ],
            ),
          );
        },
      ),
    );
  }
}
