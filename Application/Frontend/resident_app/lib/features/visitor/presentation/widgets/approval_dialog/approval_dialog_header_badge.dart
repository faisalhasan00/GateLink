import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';

/// Top floating circular icon badge with entry type icon & halo border
class ApprovalDialogHeaderBadge extends StatelessWidget {
  final IconData icon;
  final Color badgeColor;

  const ApprovalDialogHeaderBadge({
    super.key,
    required this.icon,
    required this.badgeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 0,
      child: Container(
        width: 72,
        height: 72,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryDark.withValues(alpha: 0.15),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
          border: Border.all(color: AppColors.surface, width: 4),
        ),
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: [
                badgeColor,
                badgeColor.withValues(alpha: 0.8),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Icon(
            icon,
            color: Colors.white,
            size: 34,
          ),
        ),
      ),
    );
  }
}
