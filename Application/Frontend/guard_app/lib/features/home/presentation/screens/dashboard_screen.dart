import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/guard_app_shift_header.dart';
import '../widgets/guard_app_quick_actions.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  void _showSosDialog(BuildContext context) {
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
          'Alert Society Manager and Gate Keepers immediately.',
          style: TextStyle(color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('🚨 Emergency SOS Triggered!'),
                  backgroundColor: AppColors.error,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Send SOS', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final now = DateTime.now();
    final timeStr = DateFormat('hh:mm:ss a').format(now);
    final dateStr = DateFormat('EEEE, d MMM').format(now);
    final profile = ref.watch(userProfileProvider).value;
    final guardName = (profile?['name'] as String?)?.isNotEmpty == true
        ? profile!['name'] as String
        : ((profile?['displayName'] as String?)?.isNotEmpty == true
            ? profile!['displayName'] as String
            : 'Security Guard');

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Shift Header
              GuardAppShiftHeader(
                guardName: guardName,
                dateStr: dateStr,
                timeStr: timeStr,
                onSosTap: () => _showSosDialog(context),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 2. Quick Entry Actions Grid
              GuardAppQuickActionsGrid(
                onScanQrTap: () => context.go(AppRoutes.scan),
                onQuickEntryTap: () => context.go(AppRoutes.quickEntry),
                onVehicleLogTap: () => context.go(AppRoutes.vehicles),
                onInviteCodeTap: () => context.go(AppRoutes.passcode),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 3. Quick Links Section
              const Text(
                'SYSTEM ACTIONS',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              ListTile(
                tileColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  side: const BorderSide(color: AppColors.border),
                ),
                leading: const Icon(Icons.people_alt_rounded, color: AppColors.primary),
                title: const Text('Resident Directory', style: TextStyle(fontWeight: FontWeight.w800)),
                subtitle: const Text('Search flat numbers & phone contacts', style: TextStyle(fontSize: 12)),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => context.go(AppRoutes.residents),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
