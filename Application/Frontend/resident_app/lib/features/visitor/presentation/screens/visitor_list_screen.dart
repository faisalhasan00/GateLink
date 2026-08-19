import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/visitor_model.dart';
import '../../providers/visitor_providers.dart';
import '../widgets/visitor_card.dart';
import '../widgets/visitor_pass_sheet.dart';

class VisitorListScreen extends ConsumerStatefulWidget {
  const VisitorListScreen({super.key});

  @override
  ConsumerState<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends ConsumerState<VisitorListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(visitorsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitors'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: 'Pending'),
            Tab(text: 'Expected'),
            Tab(text: 'History')
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go(AppRoutes.inviteVisitor),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add_rounded),
        label: const Text('Invite Visitor'),
      ),
      body: visitorsAsync.when(
        data: (visitors) {
          final pending = visitors.where((v) => v.isPending).toList();
          final expected = visitors.where((v) => v.isExpected).toList();
          final history =
              visitors.where((v) => !v.isPending && !v.isExpected).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _VisitorTabView(visitors: pending, isPending: true),
              _VisitorTabView(visitors: expected),
              _VisitorTabView(visitors: history, isHistory: true),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error loading visitors: $e')),
      ),
    );
  }
}

class _VisitorTabView extends ConsumerWidget {
  final List<VisitorModel> visitors;
  final bool isHistory;
  final bool isPending;

  const _VisitorTabView({
    required this.visitors,
    this.isHistory = false,
    this.isPending = false,
  });

  Future<void> _handleApproval(
    BuildContext context,
    WidgetRef ref,
    VisitorModel visitor,
    String status,
  ) async {
    final user = ref.read(currentUserProvider);
    final controller = ref.read(visitorControllerProvider.notifier);
    final isApprove = status == 'approved';

    final success = await controller.updateVisitorApproval(
      visitorId: visitor.id,
      status: status,
      residentUid: user?.uid ?? 'resident_user',
    );

    if (context.mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isApprove
                  ? '✅ Visitor ${visitor.name} approved for entry!'
                  : '🛑 Visitor ${visitor.name} denied entry.',
            ),
            backgroundColor:
                isApprove ? AppColors.success : AppColors.error,
          ),
        );
      } else {
        final errorMsg =
            ref.read(visitorControllerProvider).errorMessage ?? 'Action failed.';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (visitors.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.person_off_rounded,
              size: 56,
              color: AppColors.textDisabled,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              isHistory
                  ? 'No visitor history'
                  : (isPending
                      ? 'No pending visitors'
                      : 'No expected visitors'),
              style: const TextStyle(color: AppColors.textSecondary),
            ),
          ],
        ),
      );
    }

    final userProfile = ref.watch(userProfileProvider).value;
    final societyName =
        userProfile?['societyName'] ?? 'Housing Society';
    final flatNumber = userProfile?['flatNumber'] ?? '';

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: visitors.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, i) {
        final visitor = visitors[i];

        return VisitorCard(
          visitor: visitor,
          isPending: isPending,
          onTap: () => context.go('/home/visitors/${visitor.id}'),
          onApprove: isPending
              ? () => _handleApproval(context, ref, visitor, 'approved')
              : null,
          onDeny: isPending
              ? () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Reject Visitor?'),
                      content: Text(
                        'Are you sure you want to deny entry to ${visitor.name}?',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx, false),
                          child: const Text('Cancel'),
                        ),
                        ElevatedButton(
                          onPressed: () => Navigator.pop(ctx, true),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.error,
                          ),
                          child: const Text('Deny Entry'),
                        ),
                      ],
                    ),
                  );
                  if (confirm == true && context.mounted) {
                    await _handleApproval(context, ref, visitor, 'rejected');
                  }
                }
              : null,
          onViewQr: visitor.isExpected
              ? () => VisitorPassSheet.show(
                    context,
                    visitorId: visitor.id,
                    passCode: visitor.passCode ?? '100000',
                    visitorName: visitor.name,
                    societyName: societyName,
                    flatNumber: flatNumber,
                  )
              : null,
        );
      },
    );
  }
}
