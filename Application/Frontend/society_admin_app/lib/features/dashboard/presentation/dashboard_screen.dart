import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/state_views.dart';
import 'widgets/dashboard_quick_actions.dart';
import 'widgets/kpi_stat_card.dart';
import 'widgets/recent_visitor_item.dart';
import 'widgets/sos_alert_banner.dart';

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
          description:
              'Please select a society to view the management dashboard.',
          actionLabel: 'Select Society',
          onAction: () => context.go('/select-society'),
        ),
      );
    }

    final currencyFmt =
        NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              society.name,
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const Text(
              'Society Admin Control Panel',
              style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.normal),
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
                    children: alerts
                        .map((alert) => SosAlertBanner(alert: alert))
                        .toList(),
                  );
                },
                loading: () => const SizedBox.shrink(),
                error: (_, __) => const SizedBox.shrink(),
              ),

              // 2. QUICK ACTIONS BAR
              const DashboardQuickActions(),
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
                    child: KpiStatCard(
                      title: 'Total Residents',
                      value: residentsAsync.when(
                        data: (list) => list
                            .where((r) =>
                                r.isResident &&
                                (r.status == 'approved' ||
                                    r.status == 'active'))
                            .length
                            .toString(),
                        loading: () => '...',
                        error: (_, __) => '0',
                      ),
                      subtext: residentsAsync.when(
                        data: (list) {
                          final pending = list
                              .where((r) =>
                                  r.isResident &&
                                  (r.status == 'pending' ||
                                      r.status == 'pending_approval' ||
                                      r.status == 'pending_verification'))
                              .length;
                          return pending > 0
                              ? '$pending pending'
                              : 'All active';
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
                    child: KpiStatCard(
                      title: 'Today\'s Visitors',
                      value: visitorsAsync.when(
                        data: (list) => list.length.toString(),
                        loading: () => '...',
                        error: (_, __) => '0',
                      ),
                      subtext: visitorsAsync.when(
                        data: (list) {
                          final inside = list
                              .where((v) => v.status == 'inside')
                              .length;
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
                    child: KpiStatCard(
                      title: 'Open Complaints',
                      value: complaintsAsync.when(
                        data: (list) => list
                            .where((c) =>
                                c.status != 'resolved' &&
                                c.status != 'closed')
                            .length
                            .toString(),
                        loading: () => '...',
                        error: (_, __) => '0',
                      ),
                      subtext: complaintsAsync.when(
                        data: (list) {
                          final urgent = list
                              .where((c) =>
                                  c.priority == 'urgent' ||
                                  c.priority == 'high')
                              .length;
                          return urgent > 0
                              ? '$urgent high priority'
                              : 'Normal queue';
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
                    child: KpiStatCard(
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
                          final defaulters = list
                              .where((b) => b.status != 'paid')
                              .length;
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
                          style: TextStyle(
                              color: AppColors.textMuted, fontSize: 13),
                        ),
                      ),
                    );
                  }

                  final previewList = visitors.take(3).toList();
                  return Column(
                    children: previewList
                        .map((v) => RecentVisitorItem(visitor: v))
                        .toList(),
                  );
                },
                loading: () => const LoadingStateWidget(
                    message: 'Loading live gate feed...'),
                error: (err, _) => const ErrorStateWidget(
                    message: 'Could not load gate feed.'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
