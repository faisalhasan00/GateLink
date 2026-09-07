import 'package:flutter/material.dart';
import '../../../../core/models/resident_model.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';

class PendingResidentCard extends StatelessWidget {
  final ResidentModel resident;
  final VoidCallback onApprove;
  final VoidCallback onReject;

  const PendingResidentCard({
    super.key,
    required this.resident,
    required this.onApprove,
    required this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                radius: 22,
                backgroundColor: AppColors.amberLight,
                child: Icon(Icons.person_outline,
                    color: AppColors.accentAmber, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resident.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
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
              const AppBadge(label: 'Pending', variant: BadgeVariant.warning),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Phone: ${resident.phone}  •  Email: ${resident.email.isNotEmpty ? resident.email : 'N/A'}',
            style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: 'Reject',
                  onPressed: onReject,
                  variant: ButtonVariant.outline,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Approve',
                  onPressed: onApprove,
                  variant: ButtonVariant.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
