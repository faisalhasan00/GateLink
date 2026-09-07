import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/language_provider.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../../visitor/domain/models/visitor_model.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../../../visitor/providers/visitor_providers.dart';
import '../widgets/gate_entry_card.dart';
import '../widgets/guard_activity_filter_bar.dart';
import '../widgets/guard_dashboard_header.dart';
import '../widgets/guard_empty_activity_view.dart';
import '../widgets/guard_quick_actions_section.dart';
import '../widgets/guard_sos_dialog.dart';
import '../widgets/guard_stats_section.dart';

class GuardDashboardScreen extends ConsumerStatefulWidget {
  const GuardDashboardScreen({super.key});

  @override
  ConsumerState<GuardDashboardScreen> createState() =>
      _GuardDashboardScreenState();
}

class _GuardDashboardScreenState extends ConsumerState<GuardDashboardScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedFilter = 'All';
  late Timer _timer;
  DateTime _now = DateTime.now();
  bool _isSeedingData = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() => _now = DateTime.now());
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _markVisitorOut(String visitorId) async {
    try {
      await ref
          .read(visitorControllerProvider.notifier)
          .markVisitorExit(visitorId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded,
                    color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Visitor Departure Recorded (Exited Gate)'),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _approveEntry(String visitorId) async {
    try {
      await ref
          .read(visitorControllerProvider.notifier)
          .approveVisitorEntry(visitorId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded,
                    color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Gate Entry Allowed & Checked In'),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _seedDemoVisitors() async {
    setState(() => _isSeedingData = true);
    try {
      final profile = ref.read(userProfileProvider).value;
      final societyId =
          (profile?['societyId'] as String?)?.trim() ?? 'SS_ALPHA';
      final now = DateTime.now();

      final demoList = [
        {
          'name': 'Rahul Sharma (Swiggy Delivery)',
          'phone': '+91 98765 43210',
          'type': 'Delivery',
          'hostFlat': 'A-402',
          'company': 'Swiggy',
          'vehicleNumber': 'MH 02 AB 1234',
          'status': 'inside',
          'entryTime':
              Timestamp.fromDate(now.subtract(const Duration(minutes: 15))),
          'societyId': societyId,
          'createdAt': Timestamp.fromDate(now),
        },
        {
          'name': 'Priya Patel (Family Guest)',
          'phone': '+91 98111 22334',
          'type': 'Guest',
          'hostFlat': 'B-105',
          'notes': 'Weekend Family Visit',
          'vehicleNumber': 'MH 04 CD 5678',
          'status': 'pending',
          'entryTime':
              Timestamp.fromDate(now.subtract(const Duration(minutes: 4))),
          'societyId': societyId,
          'createdAt': Timestamp.fromDate(now),
        },
        {
          'name': 'Suresh Kumar (Urban Company)',
          'phone': '+91 97777 88899',
          'type': 'Service',
          'hostFlat': 'C-301',
          'company': 'Urban Company',
          'vehicleNumber': 'MH 01 EF 9012',
          'status': 'approved',
          'entryTime':
              Timestamp.fromDate(now.subtract(const Duration(minutes: 35))),
          'societyId': societyId,
          'createdAt': Timestamp.fromDate(now),
        },
      ];

      for (final item in demoList) {
        if (societyId.isNotEmpty) {
          await FirebaseFirestore.instance
              .collection('societies/$societyId/visitors')
              .add(item);
        }
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.bolt_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('3 Demo gate visitors added for testing!'),
              ],
            ),
            backgroundColor: const Color(0xFF1E3A8A),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error adding demo: $e'),
              backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSeedingData = false);
    }
  }

  List<VisitorModel> _filterDocs(List<VisitorModel> docs) {
    var list = docs;

    switch (_selectedFilter) {
      case 'Inside':
        list = list.where((d) => d.status.toLowerCase() == 'inside').toList();
        break;
      case 'Pending':
        list = list.where((d) => d.status.toLowerCase() == 'pending').toList();
        break;
      case 'Approved':
        list =
            list.where((d) => d.status.toLowerCase() == 'approved').toList();
        break;
      case 'Delivery':
        list = list.where((d) {
          final t = d.type.toLowerCase();
          return t.contains('delivery') ||
              t.contains('swiggy') ||
              t.contains('zomato') ||
              t.contains('blinkit') ||
              t.contains('zepto') ||
              t.contains('amazon');
        }).toList();
        break;
      case 'Cab':
        list = list.where((d) {
          final t = d.type.toLowerCase();
          return t.contains('cab') ||
              t.contains('uber') ||
              t.contains('ola') ||
              t.contains('taxi');
        }).toList();
        break;
      case 'Exited':
        list = list
            .where((d) =>
                d.status.toLowerCase() == 'left' ||
                d.status.toLowerCase() == 'exited')
            .toList();
        break;
    }

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((d) {
        return d.name.toLowerCase().contains(q) ||
            d.hostFlat.toLowerCase().contains(q) ||
            d.type.toLowerCase().contains(q) ||
            d.phone.toLowerCase().contains(q) ||
            (d.vehicleNumber != null &&
                d.vehicleNumber!.toLowerCase().contains(q));
      }).toList();
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    final tr = ref.watch(stringsProvider);
    final visitorsAsync = ref.watch(todayVisitorsStreamProvider);
    final timeStr = DateFormat('hh:mm:ss a').format(_now);
    final dateStr = DateFormat('EEEE, d MMM').format(_now);
    final user = FirebaseAuth.instance.currentUser;
    final profile = ref.watch(userProfileProvider).value;

    final guardName = profile?['name'] ??
        user?.displayName ??
        user?.email ??
        'Security Guard';
    final societyName = profile?['societyName'] ?? 'Housing Society';
    final gateName = profile?['gateName'] ?? 'Gate 1 — Main Entry';

    return visitorsAsync.when(
      loading: () => Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              AppSkeleton.card(height: 120),
              const SizedBox(height: AppSpacing.md),
              Row(
                children: [
                  Expanded(child: AppSkeleton.card(height: 72)),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(child: AppSkeleton.card(height: 72)),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              AppSkeleton.gateEntryCard(),
              AppSkeleton.gateEntryCard(),
              AppSkeleton.gateEntryCard(),
            ],
          ),
        ),
      ),
      error: (e, _) => Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline_rounded,
                    color: AppColors.error, size: 48),
                const SizedBox(height: 12),
                Text('Gate Terminal Error: $e',
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.textPrimary)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () =>
                      ref.invalidate(todayVisitorsStreamProvider),
                  child: const Text('Retry Connection'),
                ),
              ],
            ),
          ),
        ),
      ),
      data: (visitors) {
        final insideCount =
            visitors.where((d) => d.status.toLowerCase() == 'inside').length;
        final pendingCount =
            visitors.where((d) => d.status.toLowerCase() == 'pending').length;
        final approvedCount =
            visitors.where((d) => d.status.toLowerCase() == 'approved').length;
        final deliveryCount = visitors.where((d) {
          final t = d.type.toLowerCase();
          return t.contains('delivery') ||
              t.contains('swiggy') ||
              t.contains('zomato') ||
              t.contains('blinkit') ||
              t.contains('zepto') ||
              t.contains('amazon');
        }).length;
        final cabCount = visitors
            .where((d) => d.type.toLowerCase().contains('cab'))
            .length;
        final exitedCount = visitors
            .where((d) =>
                d.status.toLowerCase() == 'left' ||
                d.status.toLowerCase() == 'exited')
            .length;

        final filtered = _filterDocs(visitors);

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            onRefresh: () async =>
                ref.invalidate(todayVisitorsStreamProvider),
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: GuardDashboardHeader(
                    guardName: guardName,
                    societyName: societyName,
                    gateName: gateName,
                    timeStr: timeStr,
                    dateStr: dateStr,
                    onSosPressed: () => GuardSosDialog.show(context),
                  ),
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.pagePadding),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GuardStatsSection(
                          tr: tr,
                          insideCount: insideCount,
                          pendingCount: pendingCount,
                          approvedCount: approvedCount,
                          deliveryCount: deliveryCount,
                          exitedCount: exitedCount,
                          selectedFilter: _selectedFilter,
                          onFilterChanged: (f) =>
                              setState(() => _selectedFilter = f),
                        ),
                        const SizedBox(height: 18),
                        GuardQuickActionsSection(tr: tr),
                        const SizedBox(height: 20),
                        GuardActivityFilterBar(
                          tr: tr,
                          searchController: _searchController,
                          searchQuery: _searchQuery,
                          selectedFilter: _selectedFilter,
                          totalCount: visitors.length,
                          insideCount: insideCount,
                          pendingCount: pendingCount,
                          approvedCount: approvedCount,
                          deliveryCount: deliveryCount,
                          cabCount: cabCount,
                          exitedCount: exitedCount,
                          onSearchChanged: (v) =>
                              setState(() => _searchQuery = v),
                          onFilterSelected: (f) =>
                              setState(() => _selectedFilter = f),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            const Text(
                              'Live Gate Activity Log',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E3A8A)
                                    .withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${filtered.length} entries',
                                style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF1E3A8A)),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        if (filtered.isEmpty)
                          GuardEmptyActivityView(
                            searchQuery: _searchQuery,
                            selectedFilter: _selectedFilter,
                            isSeedingData: _isSeedingData,
                            onSeedDemo: _seedDemoVisitors,
                          )
                        else
                          ...filtered.map((visitor) {
                            return GateEntryCard(
                              visitor: visitor,
                              onMarkOut: () => _markVisitorOut(visitor.id),
                              onApprove: () => _approveEntry(visitor.id),
                            );
                          }),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
