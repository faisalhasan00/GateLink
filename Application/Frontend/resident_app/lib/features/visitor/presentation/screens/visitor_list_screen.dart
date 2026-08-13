import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/visitor_model.dart';
import '../../domain/models/visitor_status.dart';
import '../../providers/visitor_providers.dart';
import '../../../../core/services/qr_share_service.dart';

class VisitorListScreen extends ConsumerStatefulWidget {
  const VisitorListScreen({super.key});

  @override
  ConsumerState<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends ConsumerState<VisitorListScreen> with SingleTickerProviderStateMixin {
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
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitors'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [Tab(text: 'Pending'), Tab(text: 'Expected'), Tab(text: 'History')],
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
          final history = visitors.where((v) => !v.isPending && !v.isExpected).toList();

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
        error: (e, st) => Center(child: Text('Error: $e')),
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

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (visitors.isEmpty) {
      return Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.person_off_rounded, size: 56, color: AppColors.textDisabled),
          const SizedBox(height: AppSpacing.md),
          Text(isHistory ? 'No visitor history' : (isPending ? 'No pending visitors' : 'No expected visitors'),
              style: const TextStyle(color: AppColors.textSecondary)),
        ]),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: visitors.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, i) {
        final visitor = visitors[i];

        String timeStr = '';
        if (visitor.entryTime != null) {
          try {
            final dt = DateTime.parse(visitor.entryTime!);
            timeStr = '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
          } catch (_) {}
        } else if (visitor.expectedDate != null) {
          timeStr = '${visitor.expectedDate} ${visitor.expectedTime ?? ''}';
        }

        return GestureDetector(
          onTap: () => context.go('/home/visitors/${visitor.id}'),
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppColors.visitor.withValues(alpha: 0.12),
                      child: Text(visitor.initials, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.visitor)),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(visitor.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                        const SizedBox(height: 2),
                        Text(visitor.type, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(height: 2),
                        Row(children: [
                          const Icon(Icons.access_time_rounded, size: 12, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Text(timeStr, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        ]),
                      ],
                    )),
                    Column(children: [
                      _StatusBadge(status: visitor.status),
                      const SizedBox(height: 8),
                      const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.textSecondary),
                    ]),
                  ],
                ),
                if (isPending) ...[
                  const SizedBox(height: AppSpacing.md),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                title: const Text('Reject Visitor?'),
                                content: Text('Are you sure you want to deny entry to ${visitor.name}?'),
                                actions: [
                                  TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                                  ElevatedButton(
                                    onPressed: () => Navigator.pop(ctx, true),
                                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                                    child: const Text('Deny Entry'),
                                  ),
                                ],
                              ),
                            );
                            if (confirm == true) {
                              final controller = ref.read(visitorControllerProvider.notifier);
                              final user = ref.read(currentUserProvider);
                              final success = await controller.updateVisitorApproval(
                                visitorId: visitor.id, 
                                status: 'rejected', 
                                residentUid: user?.uid ?? 'resident_user',
                              );
                              if (context.mounted) {
                                if (success) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('🛑 Visitor ${visitor.name} denied entry.'), backgroundColor: AppColors.error),
                                  );
                                } else {
                                  final errorMsg = ref.read(visitorControllerProvider).errorMessage ?? 'Failed to deny visitor.';
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
                                  );
                                }
                              }
                            }
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.error,
                            side: const BorderSide(color: AppColors.error),
                          ),
                          child: const Text('Deny'),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () async {
                            final controller = ref.read(visitorControllerProvider.notifier);
                            final user = ref.read(currentUserProvider);
                            final success = await controller.updateVisitorApproval(
                              visitorId: visitor.id, 
                              status: 'approved', 
                              residentUid: user?.uid ?? 'resident_user',
                            );
                            if (context.mounted) {
                              if (success) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('✅ Visitor ${visitor.name} approved for entry!'), backgroundColor: AppColors.success),
                                );
                              } else {
                                final errorMsg = ref.read(visitorControllerProvider).errorMessage ?? 'Failed to approve visitor.';
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
                                );
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.success,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Approve'),
                        ),
                      ),
                    ],
                  ),
                ],
                if (visitor.isExpected && (visitor.passCode != null || visitor.qrCode != null)) ...[
                  const SizedBox(height: AppSpacing.md),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () => _showQrDialog(context, visitor.id, visitor.passCode ?? '100000', visitor.name),
                      icon: const Icon(Icons.qr_code_rounded, size: 16),
                      label: const Text('View / Share Pass QR'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: const BorderSide(color: AppColors.primary),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  void _showQrDialog(BuildContext context, String visitorId, String passCode, String visitorName) {
    final qrKey = GlobalKey();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: AppSpacing.lg),
            Text('Entry Pass for $visitorName', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.md),
            RepaintBoundary(
              key: qrKey,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    QrImageView(data: passCode, version: QrVersions.auto, size: 180),
                    const SizedBox(height: 8),
                    Text('Pass Code: $passCode', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 2)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            ElevatedButton.icon(
              onPressed: () => QrShareService.shareQrPass(
                qrKey: qrKey,
                visitorName: visitorName,
                societyId: 'HomeHniHood',
                flatNumber: 'Resident Flat',
                visitTime: 'Today',
              ),
              icon: const Icon(Icons.share_rounded),
              label: const Text('Share Pass with Visitor'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final VisitorStatus status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;

    switch (status) {
      case VisitorStatus.approved:
        bg = AppColors.successSurface;
        fg = AppColors.success;
        break;
      case VisitorStatus.rejected:
        bg = AppColors.error.withValues(alpha: 0.12);
        fg = AppColors.error;
        break;
      case VisitorStatus.expected:
        bg = AppColors.infoSurface;
        fg = AppColors.info;
        break;
      case VisitorStatus.inside:
        bg = AppColors.visitor.withValues(alpha: 0.12);
        fg = AppColors.visitor;
        break;
      case VisitorStatus.checkedOut:
        bg = Colors.grey.shade100;
        fg = AppColors.textSecondary;
        break;
      case VisitorStatus.pending:
      case VisitorStatus.unknown:
      default:
        bg = AppColors.warningSurface;
        fg = AppColors.warning;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(AppRadius.full)),
      child: Text(
        status.displayName,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: fg),
      ),
    );
  }
}
