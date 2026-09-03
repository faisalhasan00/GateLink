import 'dart:async';
import 'dart:ui';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/language_provider.dart';
import '../../../sos/domain/models/guard_alert_model.dart';
import '../../../sos/presentation/controllers/alert_controller.dart';
import '../../../visitor/domain/models/visitor_model.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../../../visitor/providers/visitor_providers.dart';
import '../widgets/guard_dashboard_header.dart';
import '../widgets/stat_card.dart';
import '../widgets/quick_action_button.dart';
import '../widgets/gate_entry_card.dart';
import '../widgets/patrol_incident_modal.dart';

class GuardDashboardScreen extends ConsumerStatefulWidget {
  const GuardDashboardScreen({super.key});

  @override
  ConsumerState<GuardDashboardScreen> createState() => _GuardDashboardScreenState();
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
      await ref.read(visitorControllerProvider.notifier).markVisitorExit(visitorId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Visitor Departure Recorded (Exited Gate)'),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
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
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Gate Entry Allowed & Checked In'),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
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

  Future<void> _seedDemoVisitors() async {
    setState(() => _isSeedingData = true);
    try {
      final user = FirebaseAuth.instance.currentUser;
      final profile = ref.read(userProfileProvider).value;
      final societyId = (profile?['societyId'] as String?)?.trim() ?? 'SS_ALPHA';
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
          'entryTime': Timestamp.fromDate(now.subtract(const Duration(minutes: 15))),
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
          'entryTime': Timestamp.fromDate(now.subtract(const Duration(minutes: 4))),
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
          'entryTime': Timestamp.fromDate(now.subtract(const Duration(minutes: 35))),
          'societyId': societyId,
          'createdAt': Timestamp.fromDate(now),
        },
      ];

      for (final item in demoList) {
        if (societyId.isNotEmpty) {
          await FirebaseFirestore.instance.collection('societies/$societyId/visitors').add(item);
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
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error adding demo: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSeedingData = false);
    }
  }

  void _showSosDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
        title: const Row(
          children: [
            Icon(Icons.warning_rounded, color: Color(0xFFDC2626), size: 28),
            SizedBox(width: 8),
            Text('Gate Emergency Alert', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'This broadcasts a critical high-priority emergency siren to the Society RWA, Security Supervisor, and all connected residents.',
              style: TextStyle(color: Color(0xFF475569), fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 16),
            const Text(
              'DIRECT EMERGENCY HOTLINES:',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF64748B), letterSpacing: 0.5),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildSpeedDialChip('🚓 Police (112)', '112'),
                _buildSpeedDialChip('🚑 Ambulance (102)', '102'),
                _buildSpeedDialChip('🚒 Fire (101)', '101'),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              Navigator.pop(context);
              final messenger = ScaffoldMessenger.of(context);
              try {
                final user = FirebaseAuth.instance.currentUser;
                await ref.read(alertControllerProvider.notifier).broadcastSosAlert(
                  GuardAlertModel(
                    id: '',
                    guardEmail: user?.email ?? 'Guard',
                    message: '🚨 Emergency SOS Triggered by Guard at Gate 1 Terminal',
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
                      Text('🚨 Emergency SOS broadcast to Society Management!'),
                    ],
                  ),
                  backgroundColor: const Color(0xFFDC2626),
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  duration: const Duration(seconds: 4),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            icon: const Icon(Icons.campaign_rounded, size: 18),
            label: const Text('BROADCAST SOS', style: TextStyle(fontWeight: FontWeight.w900)),
          ),
        ],
      ),
    );
  }

  Widget _buildSpeedDialChip(String label, String number) {
    return InkWell(
      onTap: () async {
        final uri = Uri.parse('tel:$number');
        if (await canLaunchUrl(uri)) await launchUrl(uri);
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFFCBD5E1)),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
        ),
      ),
    );
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
        list = list.where((d) => d.status.toLowerCase() == 'approved').toList();
        break;
      case 'Delivery':
        list = list.where((d) {
          final t = d.type.toLowerCase();
          return t.contains('delivery') || t.contains('swiggy') || t.contains('zomato') || t.contains('blinkit') || t.contains('zepto') || t.contains('amazon');
        }).toList();
        break;
      case 'Cab':
        list = list.where((d) {
          final t = d.type.toLowerCase();
          return t.contains('cab') || t.contains('uber') || t.contains('ola') || t.contains('taxi');
        }).toList();
        break;
      case 'Exited':
        list = list.where((d) => d.status.toLowerCase() == 'left' || d.status.toLowerCase() == 'exited').toList();
        break;
    }

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((d) {
        return d.name.toLowerCase().contains(q) ||
            d.hostFlat.toLowerCase().contains(q) ||
            d.type.toLowerCase().contains(q) ||
            d.phone.toLowerCase().contains(q) ||
            (d.vehicleNumber != null && d.vehicleNumber!.toLowerCase().contains(q));
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

    final guardName = profile?['name'] ?? user?.displayName ?? user?.email ?? 'Security Guard';
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
                const Icon(Icons.error_outline_rounded, color: AppColors.error, size: 48),
                const SizedBox(height: 12),
                Text('Gate Terminal Error: $e', textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textPrimary)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.invalidate(todayVisitorsStreamProvider),
                  child: const Text('Retry Connection'),
                ),
              ],
            ),
          ),
        ),
      ),
      data: (visitors) {
        final insideCount = visitors.where((d) => d.status.toLowerCase() == 'inside').length;
        final pendingCount = visitors.where((d) => d.status.toLowerCase() == 'pending').length;
        final approvedCount = visitors.where((d) => d.status.toLowerCase() == 'approved').length;
        final deliveryCount = visitors.where((d) {
          final t = d.type.toLowerCase();
          return t.contains('delivery') || t.contains('swiggy') || t.contains('zomato') || t.contains('blinkit') || t.contains('zepto') || t.contains('amazon');
        }).length;
        final exitedCount = visitors.where((d) => d.status.toLowerCase() == 'left' || d.status.toLowerCase() == 'exited').length;

        final filtered = _filterDocs(visitors);

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            onRefresh: () async => ref.invalidate(todayVisitorsStreamProvider),
            child: CustomScrollView(
              slivers: [
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
                        Row(
                          children: [
                            Expanded(
                              child: StatCard(
                                title: tr.get('inside_now'),
                                value: '$insideCount',
                                icon: Icons.meeting_room_rounded,
                                color: const Color(0xFF10B981),
                                trend: tr.get('inside_trend'),
                                isSelected: _selectedFilter == 'Inside',
                                onTap: () => setState(() => _selectedFilter = _selectedFilter == 'Inside' ? 'All' : 'Inside'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: StatCard(
                                title: tr.get('awaiting'),
                                value: '$pendingCount',
                                icon: Icons.hourglass_top_rounded,
                                color: const Color(0xFFF59E0B),
                                trend: tr.get('awaiting_trend'),
                                isSelected: _selectedFilter == 'Pending',
                                onTap: () => setState(() => _selectedFilter = _selectedFilter == 'Pending' ? 'All' : 'Pending'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: StatCard(
                                title: tr.get('approved'),
                                value: '$approvedCount',
                                icon: Icons.check_circle_rounded,
                                color: const Color(0xFF0EA5E9),
                                trend: tr.get('approved_trend'),
                                isSelected: _selectedFilter == 'Approved',
                                onTap: () => setState(() => _selectedFilter = _selectedFilter == 'Approved' ? 'All' : 'Approved'),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(width: 8, height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: StatCard(
                                title: tr.get('deliveries_today'),
                                value: '$deliveryCount',
                                icon: Icons.local_shipping_rounded,
                                color: const Color(0xFFF97316),
                                trend: tr.get('deliveries_trend'),
                                isSelected: _selectedFilter == 'Delivery',
                                onTap: () => setState(() => _selectedFilter = _selectedFilter == 'Delivery' ? 'All' : 'Delivery'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: StatCard(
                                title: tr.get('exited'),
                                value: '$exitedCount',
                                icon: Icons.exit_to_app_rounded,
                                color: const Color(0xFF64748B),
                                trend: tr.get('exited_trend'),
                                isSelected: _selectedFilter == 'Exited',
                                onTap: () => setState(() => _selectedFilter = _selectedFilter == 'Exited' ? 'All' : 'Exited'),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 18),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              tr.get('fast_gate_actions'),
                              style: const TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            Text(
                              tr.get('one_tap_triggers'),
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF059669),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: QuickActionButton(
                                icon: Icons.delivery_dining_rounded,
                                label: tr.get('action_delivery'),
                                subtitle: tr.get('action_delivery_sub'),
                                color: const Color(0xFFF97316),
                                onTap: () => context.push(AppRoutes.guardQuickEntry),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: QuickActionButton(
                                icon: Icons.person_add_alt_1_rounded,
                                label: tr.get('action_guest'),
                                subtitle: tr.get('action_guest_sub'),
                                color: const Color(0xFF1E3A8A),
                                onTap: () => context.push(AppRoutes.guardQuickEntry),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: QuickActionButton(
                                icon: Icons.local_taxi_rounded,
                                label: tr.get('action_cab'),
                                subtitle: tr.get('action_cab_sub'),
                                color: const Color(0xFFEAB308),
                                onTap: () => context.push(AppRoutes.guardVehicles),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: QuickActionButton(
                                icon: Icons.warning_rounded,
                                label: tr.get('action_sos'),
                                subtitle: tr.get('action_sos_sub'),
                                color: const Color(0xFFDC2626),
                                onTap: () => PatrolIncidentModal.show(context),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(AppRadius.lg),
                            border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.03),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: TextField(
                            controller: _searchController,
                            onChanged: (v) => setState(() => _searchQuery = v),
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                            decoration: InputDecoration(
                              hintText: tr.get('search_hint'),
                              hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13, fontWeight: FontWeight.w600),
                              prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF1E3A8A)),
                              suffixIcon: _searchQuery.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.clear_rounded, color: Color(0xFF64748B)),
                                      onPressed: () {
                                        _searchController.clear();
                                        setState(() => _searchQuery = '');
                                      },
                                    )
                                  : null,
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            ),
                          ),
                        ),

                        const SizedBox(height: 14),

                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildFilterChip('All', tr.get('filter_all'), visitors.length, Icons.dashboard_rounded),
                              _buildFilterChip('Inside', tr.get('filter_inside'), insideCount, Icons.meeting_room_rounded),
                              _buildFilterChip('Pending', tr.get('filter_pending'), pendingCount, Icons.hourglass_top_rounded),
                              _buildFilterChip('Approved', tr.get('filter_approved'), approvedCount, Icons.check_circle_rounded),
                              _buildFilterChip('Delivery', tr.get('filter_delivery'), deliveryCount, Icons.local_shipping_rounded),
                              _buildFilterChip('Cab', tr.get('filter_cab'), visitors.where((d) => d.type.toLowerCase().contains('cab')).length, Icons.local_taxi_rounded),
                              _buildFilterChip('Exited', tr.get('filter_exited'), exitedCount, Icons.exit_to_app_rounded),
                            ],
                          ),
                        ),

                        // Feed Header & Status
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
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E3A8A).withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${filtered.length} entries',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF1E3A8A)),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 10),

                        // Entries Feed List
                        if (filtered.isEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 16),
                            margin: const EdgeInsets.only(top: 8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(AppRadius.xl),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            alignment: Alignment.center,
                            child: Column(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF1F5F9),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.inbox_outlined, size: 36, color: Color(0xFF94A3B8)),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  _searchQuery.isNotEmpty
                                      ? 'No visitors found matching "$_searchQuery"'
                                      : 'No gate entries for "$_selectedFilter" today',
                                  style: const TextStyle(
                                    color: Color(0xFF0F172A),
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'New entries registered at the gate or approved by residents will stream here in real-time.',
                                  style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 16),
                                ElevatedButton.icon(
                                  onPressed: _isSeedingData ? null : _seedDemoVisitors,
                                  icon: _isSeedingData
                                      ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                      : const Icon(Icons.bolt_rounded, size: 16),
                                  label: Text(_isSeedingData ? 'Generating...' : '⚡ Seed Demo Gate Traffic'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF1E3A8A),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                                  ),
                                ),
                              ],
                            ),
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

  Widget _buildFilterChip(String filter, String label, int count, IconData icon) {
    final isSelected = _selectedFilter == filter;
    return Padding(
      padding: const EdgeInsets.only(right: 6.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => setState(() => _selectedFilter = filter),
          borderRadius: BorderRadius.circular(20),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFCBD5E1),
              ),
              boxShadow: [
                if (isSelected)
                  BoxShadow(
                    color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  size: 13,
                  color: isSelected ? Colors.white : const Color(0xFF64748B),
                ),
                const SizedBox(width: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11.5,
                    fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                    color: isSelected ? Colors.white : const Color(0xFF334155),
                  ),
                ),
                const SizedBox(width: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white.withValues(alpha: 0.25)
                        : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$count',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: isSelected ? Colors.white : const Color(0xFF64748B),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
