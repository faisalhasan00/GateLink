import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

enum BadgeVariant { primary, success, warning, danger, neutral, sky }

class AppBadge extends StatelessWidget {
  final String label;
  final BadgeVariant variant;
  final IconData? icon;
  final double fontSize;

  const AppBadge({
    super.key,
    required this.label,
    this.variant = BadgeVariant.primary,
    this.icon,
    this.fontSize = 12,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;

    switch (variant) {
      case BadgeVariant.success:
        bg = AppColors.emeraldLight;
        fg = AppColors.successEmerald;
        break;
      case BadgeVariant.warning:
        bg = AppColors.amberLight;
        fg = AppColors.accentAmber;
        break;
      case BadgeVariant.danger:
        bg = AppColors.crimsonLight;
        fg = AppColors.dangerCrimson;
        break;
      case BadgeVariant.sky:
        bg = AppColors.skyLight;
        fg = AppColors.secondarySky;
        break;
      case BadgeVariant.neutral:
        bg = AppColors.background;
        fg = AppColors.textSecondary;
        break;
      case BadgeVariant.primary:
        bg = const Color(0xFFEFF6FF);
        fg = AppColors.primaryNavy;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: fg.withValues(alpha: 0.2), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: fontSize + 2, color: fg),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: fg,
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
