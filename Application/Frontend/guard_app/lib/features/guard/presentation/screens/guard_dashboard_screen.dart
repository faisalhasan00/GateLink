import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../sos/domain/models/guard_alert_model.dart';
import '../../../sos/presentation/controllers/alert_controller.dart';
import '../../../visitor/domain/models/visitor_model.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../../../visitor/providers/visitor_providers.dart';
import '../widgets/guard_dashboard_header.dart';
import '../widgets/stat_card.dart';
import '../widgets/quick_action_button.dart';
import '../widgets/gate_entry_card.dart';

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
              // Header Widget
              SliverToBoxAdapter(
                child: GuardDashboardHeader(
                  guardName: guardName,
                  societyName: societyName,
                  gateName: gateName,
                  timeStr: timeStr,
                  dateStr: dateStr,
                  onSosPressed: _showSosDialog,
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stat Cards Grid
                      Row(
                        children: [
                          Expanded(
                            child: StatCard(
                              title: 'Inside Now',
                              value: '$insideCount',
                              icon: Icons.meeting_room_rounded,
                              color: AppColors.primary,
                              trend: 'Currently inside',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: StatCard(
                              title: 'Pending',
                              value: '$pendingCount',
                              icon: Icons.hourglass_top_rounded,
                              color: AppColors.warning,
                              trend: 'Awaiting approval',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: StatCard(
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
                            child: StatCard(
                              title: "Today's Exits",
                              value: '$exitedCount',
                              icon: Icons.exit_to_app_rounded,
                              color: AppColors.textSecondary,
                              trend: 'Checked out',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: StatCard(
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

                      // Quick Action Buttons Grid
                      Row(
                        children: [
                          Expanded(
                            child: QuickActionButton(
                              icon: Icons.person_add_alt_1_rounded,
                              label: 'Log Entry',
                              color: AppColors.primary,
                              onTap: () => context.go(AppRoutes.guardQuickEntry),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: QuickActionButton(
                              icon: Icons.qr_code_scanner_rounded,
                              label: 'Scan QR',
                              color: const Color(0xFF1A2A3A),
                              onTap: () => context.go(AppRoutes.guardScan),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: QuickActionButton(
                              icon: Icons.directions_car_rounded,
                              label: 'Vehicles',
                              color: AppColors.success,
                              onTap: () => context.go(AppRoutes.guardVehicles),
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

                      // Category Filter Pills
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

                      // Entries Feed List
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
                            child: GateEntryCard(
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
