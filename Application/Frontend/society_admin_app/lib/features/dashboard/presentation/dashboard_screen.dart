import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/sos_model.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final residentsAsync = ref.watch(residentsStreamProvider);
    final visitorsAsync = ref.watch(visitorsStreamProvider);
    final complaintsAsync = ref.watch(complaintsStreamProvider);
    final maintenanceAsync = ref.watch(maintenanceBillsStreamProvider);
    final sosAsync = ref.watch(sosAlertsStreamProvider);

    if (society == null) {
      return Scaffold(
        body: EmptyStateWidget(
          title: 'No Society Selected',
          description: 'Please select a society to view the management dashboard.',
          actionLabel: 'Select Society',
          onAction: () => context.go('/select-society'),
        ),
      );
    }

    final currencyFmt = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              society.name,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const Text(
              'Society Admin Control Panel',
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.sync_alt_rounded),
            tooltip: 'Switch Society',
            onPressed: () => context.push('/select-society'),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            tooltip: 'Notices',
            onPressed: () => context.push('/notices'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(residentsStreamProvider);
          ref.invalidate(visitorsStreamProvider);
          ref.invalidate(complaintsStreamProvider);
          ref.invalidate(maintenanceBillsStreamProvider);
          ref.invalidate(sosAlertsStreamProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. LIVE SOS BANNER (If Active)
              sosAsync.when(
                data: (alerts) {
                  if (alerts.isEmpty) return const SizedBox.shrink();
                  return Column(
                    children: alerts.map((alert) => _SosAlertBanner(alert: alert)).toList(),
                  );
                },
                loading: () => const SizedBox.shrink(),
                error: (_, __) => const SizedBox.shrink(),
              ),

              // 2. QUICK ACTIONS BAR
              Text(
                'Quick Operations',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.person_add_outlined,
                      label: 'Approvals',
                      color: AppColors.primaryNavy,
                      onTap: () => context.push('/residents'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.campaign_outlined,
                      label: 'Post Notice',
                      color: AppColors.secondarySky,
                      onTap: () => context.push('/notices'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.security_outlined,
                      label: 'Gate Live',
                      color: AppColors.purple,
                      onTap: () => context.push('/gate-security'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.receipt_long_outlined,
                      label: 'Collect Dues',
                      color: AppColors.successEmerald,
                      onTap: () => context.push('/maintenance'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 3. KPI STATS GRID
              Text(
                'Society Overview',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _KpiStatCard(
                      title: 'Total Residents',
                      value: residentsAsync.when(
                        data: (list) => list.where((r) => r.isResident && (r.status == 'approved' || r.status == 'active')).length.toString(),
                        loading: () => '...',
                        error: (_, __) => '0',
                      ),
                      subtext: residentsAsync.when(
                        data: (list) {
                          final pending = list.where((r) => r.isResident && (r.status == 'pending' || r.status == 'pending_approval' || r.status == 'pending_verification')).length;
                          return pending > 0 ? '$pending pending' : 'All active';
                        },
                        loading: () => '',
                        error: (_, __) => '',
                      ),
                      badgeVariant: BadgeVariant.primary,
                      icon: Icons.people_alt_outlined,
                      onTap: () => context.push('/residents'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _KpiStatCard(
                      title: 'Today\'s Visitors',
                      value: visitorsAsync.when(
                        data: (list) => list.length.toString(),
                        loading: () => '...',
                        error: (_, __) => '0',
                      ),
                      subtext: visitorsAsync.when(
                        data: (list) {
                          final inside = list.where((v) => v.status == 'inside').length;
                          return '$inside inside premises';
                        },
                        loading: () => '',
                        error: (_, __) => '',
                      ),
                      badgeVariant: BadgeVariant.sky,
                      icon: Icons.door_front_door_outlined,
                      onTap: () => context.push('/gate-security'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _KpiStatCard(
                      title: 'Open Complaints',
                      value: complaintsAsync.when(
                        data: (list) => list.where((c) => c.status != 'resolved' && c.status != 'closed').length.toString(),
                        loading: () => '...',
                        error: (_, __) => '0',
                      ),
                      subtext: complaintsAsync.when(
                        data: (list) {
                          final urgent = list.where((c) => c.priority == 'urgent' || c.priority == 'high').length;
                          return urgent > 0 ? '$urgent high priority' : 'Normal queue';
                        },
                        loading: () => '',
                        error: (_, __) => '',
                      ),
                      badgeVariant: BadgeVariant.warning,
                      icon: Icons.report_problem_outlined,
                      onTap: () => context.push('/complaints'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _KpiStatCard(
                      title: 'Maintenance Dues',
                      value: maintenanceAsync.when(
                        data: (list) {
                          final pendingSum = list
                              .where((b) => b.status != 'paid')
                              .fold(0.0, (acc, b) => acc + b.amount);
                          return currencyFmt.format(pendingSum);
                        },
                        loading: () => '...',
                        error: (_, __) => '₹0',
                      ),
                      subtext: maintenanceAsync.when(
                        data: (list) {
                          final defaulters = list.where((b) => b.status != 'paid').length;
                          return '$defaulters pending invoices';
                        },
                        loading: () => '',
                        error: (_, __) => '',
                      ),
                      badgeVariant: BadgeVariant.danger,
                      icon: Icons.account_balance_wallet_outlined,
                      onTap: () => context.push('/maintenance'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 4. RECENT VISITOR STREAM PREVIEW
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Live Gate Activity',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  TextButton(
                    onPressed: () => context.push('/gate-security'),
                    child: const Text('View All'),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              visitorsAsync.when(
                data: (visitors) {
                  if (visitors.isEmpty) {
                    return const AppCard(
                      padding: EdgeInsets.all(20),
                      child: Center(
                        child: Text(
                          'No visitor check-ins recorded today.',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        ),
                      ),
                    );
                  }

                  final previewList = visitors.take(3).toList();
                  return Column(
                    children: previewList.map((v) => _RecentVisitorItem(visitor: v)).toList(),
                  );
                },
                loading: () => const LoadingStateWidget(message: 'Loading live gate feed...'),
                error: (err, _) => const ErrorStateWidget(message: 'Could not load gate feed.'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SosAlertBanner extends ConsumerWidget {
  final SosAlertModel alert;

  const _SosAlertBanner({required this.alert});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.dangerCrimson,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.dangerCrimson.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 36),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'EMERGENCY SOS: Flat ${alert.flatNo}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${alert.residentName} triggered ${alert.emergencyType.toUpperCase()} alert',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.dangerCrimson,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              if (society != null) {
                await ref.read(firestoreServiceProvider).resolveSosAlert(
                      society.id,
                      alert.id,
                      'Admin',
                    );
              }
            },
            child: const Text('Resolve', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _KpiStatCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtext;
  final BadgeVariant badgeVariant;
  final IconData icon;
  final VoidCallback onTap;

  const _KpiStatCard({
    required this.title,
    required this.value,
    required this.subtext,
    required this.badgeVariant,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
              Icon(icon, size: 18, color: AppColors.textMuted),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          if (subtext.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              subtext,
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _RecentVisitorItem extends StatelessWidget {
  final dynamic visitor;

  const _RecentVisitorItem({required this.visitor});

  @override
  Widget build(BuildContext context) {
    final timeStr = visitor.inTime != null
        ? DateFormat('hh:mm a').format(visitor.inTime)
        : 'Just now';

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: AppCard(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            const CircleAvatar(
              radius: 20,
              backgroundColor: AppColors.skyLight,
              child: Icon(Icons.person, color: AppColors.secondarySky, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    visitor.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    'Flat ${visitor.flatNo} • ${visitor.purpose}',
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                AppBadge(
                  label: visitor.status.toString().toUpperCase(),
                  variant: visitor.status == 'inside' ? BadgeVariant.success : BadgeVariant.neutral,
                  fontSize: 10,
                ),
                const SizedBox(height: 4),
                Text(
                  timeStr,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
