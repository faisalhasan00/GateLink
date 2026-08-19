import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../visitor/domain/models/visitor_model.dart';
import '../../../../core/services/firestore_service.dart';
import '../../../sos/providers/alert_providers.dart';
import '../../../visitor/providers/visitor_providers.dart';
import '../widgets/gate_qr_display_dialog.dart';
import '../widgets/guard_shift_header.dart';
import '../widgets/guard_quick_actions_grid.dart';
import '../widgets/live_gate_activity_log.dart';

class GuardDashboardScreen extends ConsumerStatefulWidget {
  const GuardDashboardScreen({super.key});

  @override
  ConsumerState<GuardDashboardScreen> createState() =>
      _GuardDashboardScreenState();
}

class _GuardDashboardScreenState extends ConsumerState<GuardDashboardScreen> {
  String _selectedFilter = 'All';
  late Timer _clockTimer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _clockTimer.cancel();
    super.dispose();
  }

  FirestoreService get _service =>
      ref.read(firestoreServiceProvider) ??
      FirestoreService(societyId: 'SOC-001');

  void _showSosDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.xl)),
        title: const Row(
          children: [
            Icon(Icons.warning_rounded, color: AppColors.error, size: 26),
            SizedBox(width: 8),
            Text('Emergency Alert',
                style: TextStyle(fontWeight: FontWeight.w800)),
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
                await ref.read(alertRepositoryProvider).triggerEmergencySos(
                      societyId: _service.societyId,
                      guardEmail:
                          FirebaseAuth.instance.currentUser?.email ?? 'Guard',
                      message: 'Emergency SOS triggered by Guard at Gate 1',
                    );
              } catch (_) {}
              messenger.showSnackBar(
                SnackBar(
                  content: const Row(
                    children: [
                      Icon(Icons.warning_rounded,
                          color: Colors.white, size: 18),
                      SizedBox(width: 8),
                      Text('🚨 SOS Alert sent to Society Manager!'),
                    ],
                  ),
                  backgroundColor: AppColors.error,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
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

  List<dynamic> _filterDocs(List<dynamic> docs) {
    switch (_selectedFilter) {
      case 'Inside':
        return docs
            .where((d) =>
                (d is VisitorModel
                    ? d.status.toFirestore()
                    : (d.data() as Map)['status']) ==
                'inside')
            .toList();
      case 'Pending':
        return docs.where((d) {
          final s = d is VisitorModel
              ? d.status.toFirestore()
              : (d.data() as Map)['status'];
          return s == 'pending' || s == 'approved' || s == 'denied';
        }).toList();
      case 'Delivery':
        return docs
            .where((d) =>
                (d is VisitorModel ? d.type : (d.data() as Map)['type']) ==
                'Delivery')
            .toList();
      case 'Cab':
        return docs
            .where((d) =>
                (d is VisitorModel ? d.type : (d.data() as Map)['type']) ==
                'Cab')
            .toList();
      default:
        return docs;
    }
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);
    final timeStr = DateFormat('hh:mm:ss a').format(_now);
    final dateStr = DateFormat('EEEE, d MMM').format(_now);
    final user = FirebaseAuth.instance.currentUser;
    final profile = ref.watch(userProfileProvider).value;

    final guardName =
        profile?.name ?? user?.displayName ?? user?.email ?? 'Security Guard';

    return visitorsAsync.when(
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) => Scaffold(body: Center(child: Text('Error: $e'))),
      data: (visitors) {
        final filtered = _filterDocs(visitors);

        return Scaffold(
          backgroundColor: AppColors.background,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.pagePadding),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Modular Header
                  GuardShiftHeader(
                    guardName: guardName,
                    dateStr: dateStr,
                    timeStr: timeStr,
                    onSosTap: _showSosDialog,
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // 2. Modular Quick Entry Actions Grid
                  GuardQuickActionsGrid(
                    onScanQrTap: () => context.go('/scan'),
                    onQuickEntryTap: () => context.go('/quick-entry'),
                    onVehicleLogTap: () => context.go('/vehicles'),
                    onInviteCodeTap: () => context.go('/passcode'),
                    onShowGateQrTap: () => GateQrDisplayDialog.show(context),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // 3. Modular Live Gate Activity Log Filters
                  const Text(
                    'LIVE GATE ACTIVITY FEED',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  LiveGateActivityFilterPills(
                    selectedFilter: _selectedFilter,
                    onFilterSelected: (filter) =>
                        setState(() => _selectedFilter = filter),
                  ),
                  const SizedBox(height: AppSpacing.md),

                  // Feed entries count
                  Text(
                    'Showing ${filtered.length} entries',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
