import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/models/resident_model.dart';
import '../../../../core/providers/admin_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';

class ResidentDetailsBottomSheet extends ConsumerWidget {
  final ResidentModel resident;
  final String societyId;

  const ResidentDetailsBottomSheet({
    super.key,
    required this.resident,
    required this.societyId,
  });

  static void show(
    BuildContext context, {
    required ResidentModel resident,
    required String societyId,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ResidentDetailsBottomSheet(
        resident: resident,
        societyId: societyId,
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isSuspended = resident.status == 'suspended';

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: AppColors.skyLight,
                child: Text(
                  resident.name.isNotEmpty
                      ? resident.name[0].toUpperCase()
                      : 'R',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryNavy,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resident.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Flat: ${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo} • ${resident.userType.toUpperCase()}',
                      style: const TextStyle(
                          fontSize: 13, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              AppBadge(
                label: resident.status.toUpperCase(),
                variant: isSuspended
                    ? BadgeVariant.danger
                    : resident.status == 'approved' ||
                            resident.status == 'active'
                        ? BadgeVariant.success
                        : BadgeVariant.warning,
              ),
            ],
          ),
          const Divider(height: 32),
          _detailRow(Icons.phone_outlined, 'Phone', resident.phone),
          const SizedBox(height: 10),
          _detailRow(Icons.email_outlined, 'Email',
              resident.email.isNotEmpty ? resident.email : 'N/A'),
          const SizedBox(height: 10),
          _detailRow(
              Icons.apartment_outlined,
              'Unit / Wing',
              '${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo}'),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: isSuspended ? 'Activate Access' : 'Suspend Access',
                  variant: ButtonVariant.outline,
                  onPressed: () async {
                    final newStatus = isSuspended ? 'active' : 'suspended';
                    await ref
                        .read(firestoreServiceProvider)
                        .updateResidentStatus(
                          societyId,
                          resident.id,
                          newStatus,
                        );
                    if (context.mounted) Navigator.pop(context);
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Delete',
                  variant: ButtonVariant.danger,
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (dCtx) => AlertDialog(
                        title: const Text('Delete Resident?'),
                        content: Text(
                            'Are you sure you want to delete "${resident.name}"? This removes their login permissions.'),
                        actions: [
                          TextButton(
                              onPressed: () => Navigator.pop(dCtx, false),
                              child: const Text('Cancel')),
                          TextButton(
                            onPressed: () => Navigator.pop(dCtx, true),
                            style: TextButton.styleFrom(
                                foregroundColor: AppColors.dangerCrimson),
                            child: const Text('Delete'),
                          ),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      await ref
                          .read(firestoreServiceProvider)
                          .deleteResident(
                            societyId,
                            resident.id,
                          );
                      if (context.mounted) Navigator.pop(context);
                    }
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.textMuted),
        const SizedBox(width: 10),
        Text(
          '$label: ',
          style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w600),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
                fontSize: 13,
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w700),
          ),
        ),
      ],
    );
  }
}
