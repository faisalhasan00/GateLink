import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/maintenance_providers.dart';

class MaintenanceEmptyBillsView extends StatelessWidget {
  final bool isPaid;
  final WidgetRef ref;

  const MaintenanceEmptyBillsView({
    super.key,
    required this.isPaid,
    required this.ref,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isPaid ? Icons.check_circle_outline_rounded : Icons.receipt_long_rounded,
            size: 56,
            color: AppColors.textDisabled,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            isPaid ? 'No paid bills recorded' : 'No pending maintenance bills 🎉',
            style: const TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.lg),
          if (!isPaid)
            ElevatedButton.icon(
              onPressed: () async {
                try {
                  final user = ref.read(currentUserProvider);
                  final profile = ref.read(userProfileProvider).value;
                  final activeSocId = profile?.societyId ?? '';
                  final flatNum = profile?.displayFlatNumber ?? 'Flat A-402';
                  if (activeSocId.isEmpty || user == null) return;

                  await ref.read(maintenanceControllerProvider.notifier).seedDemoBills(
                        societyId: activeSocId,
                        residentUid: user.uid,
                        flatNumber: flatNum,
                      );
                } catch (e) {
                  debugPrint('Seeding error: $e');
                }
              },
              icon: const Icon(Icons.receipt_long_rounded, size: 18),
              label: const Text('Generate Sample Maintenance Bill'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A8A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
