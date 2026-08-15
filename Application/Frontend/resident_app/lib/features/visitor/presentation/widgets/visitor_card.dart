
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../domain/models/visitor_model.dart';
import 'visitor_status_badge.dart';

class VisitorCard extends StatelessWidget {
  final VisitorModel visitor;
  final bool isPending;
  final VoidCallback onTap;
  final VoidCallback? onApprove;
  final VoidCallback? onDeny;
  final VoidCallback? onViewQr;

  const VisitorCard({
    super.key,
    required this.visitor,
    required this.isPending,
    required this.onTap,
    this.onApprove,
    this.onDeny,
    this.onViewQr,
  });

  @override
  Widget build(BuildContext context) {
    String timeStr = '';
    if (visitor.entryTime != null) {
      try {
        final dt = DateTime.parse(visitor.entryTime!);
        timeStr =
            '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
      } catch (_) {}
    } else if (visitor.expectedDate != null) {
      timeStr = '${visitor.expectedDate} ${visitor.expectedTime ?? ''}';
    }

    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppAvatar(
                name: visitor.name,
                size: AppAvatarSize.md,
                backgroundColor: AppColors.visitor.withValues(alpha: 0.12),
                textColor: AppColors.visitor,
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      visitor.name,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      visitor.type,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    if (timeStr.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(
                            Icons.access_time_rounded,
                            size: 12,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            timeStr,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              Column(
                children: [
                  VisitorStatusBadge(status: visitor.status),
                  const SizedBox(height: 8),
                  const Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 12,
                    color: AppColors.textSecondary,
                  ),
                ],
              ),
            ],
          ),
          if (isPending) ...[
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Deny',
                    onPressed: onDeny,
                    variant: AppButtonVariant.danger,
                    size: AppButtonSize.sm,
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: AppButton(
                    text: 'Approve',
                    onPressed: onApprove,
                    variant: AppButtonVariant.primary,
                    size: AppButtonSize.sm,
                  ),
                ),
              ],
            ),
          ],
          if (visitor.isExpected &&
              (visitor.passCode != null || visitor.qrCode != null) &&
              onViewQr != null) ...[
            const SizedBox(height: AppSpacing.md),
            AppButton(
              text: 'View / Share Pass QR',
              onPressed: onViewQr,
              variant: AppButtonVariant.outline,
              size: AppButtonSize.sm,
              leadingIcon: Icons.qr_code_rounded,
            ),
          ],
        ],
      ),
    );
  }
}
