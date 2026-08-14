import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../sos/domain/models/guard_alert_model.dart';
import '../../../sos/presentation/controllers/alert_controller.dart';
import '../../../visitor/domain/models/visitor_model.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../../../visitor/providers/visitor_providers.dart';

class GuardDashboardScreen extends ConsumerStatefulWidget {
  const GuardDashboardScreen({super.key});

  @override
  ConsumerState<GuardDashboardScreen> createState() => _GuardDashboardScreenState();
}

class _GuardDashboardScreenState extends ConsumerState<GuardDashboardScreen> {
  String _selectedFilter = 'All';
  late Timer _clockTimer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _clockTimer.cancel();
    super.dispose();
  }

  Future<void> _markCheckedOut(String visitorId) async {
    try {
      await ref.read(visitorControllerProvider.notifier).markVisitorExit(visitorId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Visitor marked as exited'),
              ],
            ),
            backgroundColor: AppColors.success,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _approveEntry(String visitorId) async {
    try {
      await ref.read(visitorControllerProvider.notifier).approveVisitorEntry(visitorId);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _showSosDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
        title: const Row(
          children: [
            Icon(Icons.warning_rounded, color: AppColors.error, size: 26),
            SizedBox(width: 8),
            Text('Emergency Alert', style: TextStyle(fontWeight: FontWeight.w800)),
          ],
        ),
        content: const Text(
          'This will immediately alert the Society Manager and all residents. Use only in case of a genuine emergency.',
          style: TextStyle(color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              final messenger = ScaffoldMessenger.of(context);
              try {
                final user = FirebaseAuth.instance.currentUser;
                await ref.read(alertControllerProvider.notifier).broadcastSosAlert(
                  GuardAlertModel(
                    id: '',
                    guardEmail: user?.email ?? 'Guard',
                    message: 'Emergency SOS triggered by Guard at Gate 1',
                    type: 'SOS',
                    status: 'active',
                    createdAt: DateTime.now(),
                  ),
                );
              } catch (_) {}
              messenger.showSnackBar(
                SnackBar(
                  content: const Row(
                    children: [
                      Icon(Icons.warning_rounded, color: Colors.white, size: 18),
                      SizedBox(width: 8),
                      Text('🚨 SOS Alert sent to Society Manager!'),
                    ],
                  ),
                  backgroundColor: AppColors.error,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  duration: const Duration(seconds: 4),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            child: const Text('Send SOS'),
          ),
        ],
      ),
    );
  }

  List<VisitorModel> _filterDocs(List<VisitorModel> docs) {
    switch (_selectedFilter) {
      case 'Inside':
        return docs.where((d) => d.status == 'inside').toList();
      case 'Pending':
        return docs.where((d) {
          final s = d.status;
          return s == 'pending' || s == 'approved' || s == 'denied';
        }).toList();
      case 'Delivery':
        return docs.where((d) => d.type == 'Delivery').toList();
      case 'Cab':
        return docs.where((d) => d.type == 'Cab').toList();
      default:
        return docs;
    }
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(todayVisitorsStreamProvider);
    final timeStr = DateFormat('hh:mm:ss a').format(_now);
    final dateStr = DateFormat('EEEE, d MMM').format(_now);
    final user = FirebaseAuth.instance.currentUser;
    final profile = ref.watch(userProfileProvider).value;

    final guardName = profile?['name'] ?? user?.displayName ?? user?.email ?? 'Security Guard';
    final societyName = profile?['societyName'] ?? 'Housing Society';
    final gateName = profile?['gateName'] ?? 'Gate 1 — Main Entry';

    return visitorsAsync.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) => Scaffold(body: Center(child: Text('Error: $e'))),
      data: (visitors) {
        final insideCount = visitors.where((d) => d.status == 'inside').length;
        final pendingCount = visitors.where((d) => d.status == 'pending').length;
        final approvedCount = visitors.where((d) => d.status == 'approved').length;
        final exitedCount = visitors.where((d) => d.status == 'left').length;
        final filtered = _filterDocs(visitors);

        return Scaffold(
          backgroundColor: AppColors.background,
          body: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF0F1923), Color(0xFF1A2A3A)],
                    ),
                  ),
                  child: SafeArea(
                    bottom: false,
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(
                        AppSpacing.pagePadding,
                        AppSpacing.md,
                        AppSpacing.pagePadding,
                        AppSpacing.xl,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              GestureDetector(
                                onTap: () => context.go('/profile'),
                                child: const CircleAvatar(
                                  radius: 24,
                                  backgroundColor: AppColors.primary,
                                  child: Icon(Icons.shield_rounded, color: Colors.white, size: 24),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: GestureDetector(
                                  onTap: () => context.go('/profile'),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        guardName,
                                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        '$societyName  •  $gateName',
                                        style: const TextStyle(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w500),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              GestureDetector(
                                onTap: _showSosDialog,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppColors.error,
                                    borderRadius: BorderRadius.circular(AppRadius.full),
                                    boxShadow: [
                                      BoxShadow(
                                        color: AppColors.error.withValues(alpha: 0.4),
                                        blurRadius: 10,
                                        offset: const Offset(0, 3),
                                      ),
                                    ],
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(Icons.emergency_rounded, color: Colors.white, size: 14),
                                      SizedBox(width: 4),
                                      Text(
                                        'SOS',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w900,
                                          color: Colors.white,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              IconButton(
                                onPressed: () async {
                                  await FirebaseAuth.instance.signOut();
                                  if (context.mounted) {
                                    context.go('/login');
                                  }
                                },
                                icon: const Icon(Icons.logout_rounded, color: Colors.white70),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppSpacing.xl),

                          // Clock
                          Row(
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    timeStr,
                                    style: const TextStyle(
                                      fontSize: 28,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                      fontFeatures: [FontFeature.tabularFigures()],
                                    ),
                                  ),
                                  Text(
                                    dateStr,
                                    style: const TextStyle(fontSize: 12, color: Colors.white60),
                                  ),
                                ],
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppColors.successSurface.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(AppRadius.full),
                                  border: Border.all(color: AppColors.success.withValues(alpha: 0.4)),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.circle, color: AppColors.success, size: 8),
                                    SizedBox(width: 6),
                                    Text(
                                      'ON DUTY',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.success,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stat Cards
                      Row(
                        children: [
                          Expanded(
                            child: _StatCard(
                              title: 'Inside Now',
                              value: '$insideCount',
                              icon: Icons.meeting_room_rounded,
                              color: AppColors.primary,
                              trend: 'Currently inside',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: _StatCard(
                              title: 'Pending',
                              value: '$pendingCount',
                              icon: Icons.hourglass_top_rounded,
                              color: AppColors.warning,
                              trend: 'Awaiting approval',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: _StatCard(
                              title: 'Approved',
                              value: '$approvedCount',
                              icon: Icons.check_circle_rounded,
                              color: AppColors.success,
                              trend: 'Today',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        children: [
                          Expanded(
                            child: _StatCard(
                              title: "Today's Exits",
                              value: '$exitedCount',
                              icon: Icons.exit_to_app_rounded,
                              color: AppColors.textSecondary,
                              trend: 'Checked out',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: _StatCard(
                              title: 'Total Today',
                              value: '${visitors.length}',
                              icon: Icons.groups_rounded,
                              color: AppColors.info,
                              trend: 'Total entries',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Quick Actions
                      Row(
                        children: [
                          Expanded(
                            child: _QuickActionButton(
                              icon: Icons.person_add_alt_1_rounded,
                              label: 'Log Entry',
                              color: AppColors.primary,
                              onTap: () => context.go('/quick-entry'),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: _QuickActionButton(
                              icon: Icons.qr_code_scanner_rounded,
                              label: 'Scan QR',
                              color: const Color(0xFF1A2A3A),
                              onTap: () => context.go('/scan'),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: _QuickActionButton(
                              icon: Icons.directions_car_rounded,
                              label: 'Vehicles',
                              color: AppColors.success,
                              onTap: () => context.go('/vehicles'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Live Feed Header
                      Row(
                        children: [
                          const Text(
                            'Live Gate Feed',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.errorSurface,
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text(
                              '${filtered.length} entries',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.error),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),

                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: ['All', 'Inside', 'Pending', 'Delivery', 'Cab'].map((filter) {
                            final isSelected = _selectedFilter == filter;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: GestureDetector(
                                onTap: () => setState(() => _selectedFilter = filter),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                                  decoration: BoxDecoration(
                                    color: isSelected ? AppColors.secondary : Colors.white,
                                    borderRadius: BorderRadius.circular(AppRadius.full),
                                    border: Border.all(
                                      color: isSelected ? AppColors.secondary : AppColors.border,
                                    ),
                                  ),
                                  child: Text(
                                    filter,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                                      color: isSelected ? Colors.white : AppColors.textSecondary,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Entries List
                      if (filtered.isEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 48),
                          alignment: Alignment.center,
                          child: Column(
                            children: [
                              const Icon(Icons.inbox_rounded, size: 48, color: AppColors.gray300),
                              const SizedBox(height: 12),
                              Text(
                                'No entries for "$_selectedFilter"',
                                style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                              ),
                            ],
                          ),
                        )
                      else
                        ...filtered.map((visitor) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                            child: _GateEntryCard(
                              visitor: visitor,
                              onMarkOut: () => _markCheckedOut(visitor.id),
                              onApprove: () => _approveEntry(visitor.id),
                            ),
                          );
                        }),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final String trend;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.trend,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
          ),
          Text(
            title,
            style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          Text(
            trend,
            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: color),
          ),
        ],
      ),
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.3),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 22),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GateEntryCard extends StatelessWidget {
  final VisitorModel visitor;
  final VoidCallback onMarkOut;
  final VoidCallback onApprove;

  const _GateEntryCard({
    required this.visitor,
    required this.onMarkOut,
    required this.onApprove,
  });

  Color get _typeColor {
    switch (visitor.type) {
      case 'Delivery':
        return const Color(0xFFEA580C);
      case 'Cab':
        return const Color(0xFFCA8A04);
      case 'Daily Help':
        return const Color(0xFF059669);
      default:
        return const Color(0xFF2563EB);
    }
  }

  IconData get _typeIcon {
    switch (visitor.type) {
      case 'Delivery':
        return Icons.local_shipping_rounded;
      case 'Cab':
        return Icons.local_taxi_rounded;
      case 'Daily Help':
        return Icons.cleaning_services_rounded;
      default:
        return Icons.person_rounded;
    }
  }

  String get _status => visitor.status;

  @override
  Widget build(BuildContext context) {
    final timeStr = visitor.entryTime != null ? DateFormat('hh:mm a').format(visitor.entryTime!) : '--';

    return GestureDetector(
      onTap: () => context.go('/visitors/${visitor.id}'),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.xl),
          border: Border.all(
            color: _status == 'pending' ? AppColors.warning : AppColors.border,
            width: _status == 'pending' ? 1.5 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: _typeColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Icon(_typeIcon, color: _typeColor, size: 22),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              visitor.name,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          _StatusBadge(status: _status),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Flat ${visitor.hostFlat} • ${visitor.type}',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.access_time_rounded, size: 11, color: AppColors.textSecondary),
                          const SizedBox(width: 3),
                          Text(
                            'Entry: $timeStr',
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                          ),
                          if (visitor.vehicleNumber != null && visitor.vehicleNumber!.isNotEmpty) ...[
                            const SizedBox(width: 8),
                            const Icon(Icons.directions_car_rounded, size: 11, color: AppColors.primary),
                            const SizedBox(width: 2),
                            Text(
                              visitor.vehicleNumber!,
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (_status == 'inside') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton.icon(
                    onPressed: onMarkOut,
                    icon: const Icon(Icons.logout_rounded, size: 14),
                    label: const Text('Mark Exit'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      minimumSize: const Size(100, 32),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ] else if (_status == 'pending') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              const Row(
                children: [
                  Icon(Icons.hourglass_top_rounded, size: 14, color: AppColors.warning),
                  SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Waiting for resident approval...',
                      style: TextStyle(fontSize: 11, color: AppColors.warning, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ] else if (_status == 'approved') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.check_circle_rounded, size: 14, color: AppColors.success),
                  const SizedBox(width: 4),
                  const Expanded(
                    child: Text(
                      'Approved by Resident',
                      style: TextStyle(fontSize: 11, color: AppColors.success, fontWeight: FontWeight.w500),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: onApprove,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(90, 32),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                    child: const Text('Check In'),
                  ),
                ],
              ),
            ] else if (_status == 'denied') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              const Row(
                children: [
                  Icon(Icons.cancel_rounded, size: 14, color: AppColors.error),
                  SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Entry Denied by Resident',
                      style: TextStyle(fontSize: 11, color: AppColors.error, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    switch (status) {
      case 'inside':
        bg = AppColors.successSurface;
        fg = AppColors.success;
        label = 'INSIDE';
        break;
      case 'left':
        bg = AppColors.gray100;
        fg = AppColors.gray600;
        label = 'EXITED';
        break;
      case 'approved':
        bg = AppColors.successSurface;
        fg = AppColors.success;
        label = 'APPROVED';
        break;
      case 'denied':
        bg = AppColors.errorSurface;
        fg = AppColors.error;
        label = 'DENIED';
        break;
      case 'pending':
        bg = AppColors.warningSurface;
        fg = AppColors.warning;
        label = 'WAITING';
        break;
      default:
        bg = AppColors.gray100;
        fg = AppColors.gray600;
        label = status.toUpperCase();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: fg, letterSpacing: 0.5),
      ),
    );
  }
}
