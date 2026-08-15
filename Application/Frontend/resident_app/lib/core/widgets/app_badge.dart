import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

enum AppBadgeVariant { success, warning, error, info, neutral, primary }
enum AppBadgeSize { sm, md }

class AppBadge extends StatelessWidget {
  final String text;
  final AppBadgeVariant variant;
  final AppBadgeSize size;
  final IconData? leadingIcon;
  final bool showDot;
  final Color? customBackgroundColor;
  final Color? customTextColor;

  const AppBadge({
    super.key,
    required this.text,
    this.variant = AppBadgeVariant.neutral,
    this.size = AppBadgeSize.md,
    this.leadingIcon,
    this.showDot = false,
    this.customBackgroundColor,
    this.customTextColor,
  });

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color textColor;

    switch (variant) {
      case AppBadgeVariant.success:
        backgroundColor = AppColors.successSurface;
        textColor = AppColors.success;
        break;
      case AppBadgeVariant.warning:
        backgroundColor = AppColors.warningSurface;
        textColor = AppColors.warning;
        break;
      case AppBadgeVariant.error:
        backgroundColor = AppColors.errorSurface;
        textColor = AppColors.error;
        break;
      case AppBadgeVariant.info:
        backgroundColor = AppColors.infoSurface;
        textColor = AppColors.info;
        break;
      case AppBadgeVariant.neutral:
        backgroundColor = AppColors.surface;
        textColor = AppColors.textSecondary;
        break;
      case AppBadgeVariant.primary:
        backgroundColor = AppColors.primarySurface;
        textColor = AppColors.primary;
        break;
    }

    final effectiveBg = customBackgroundColor ?? backgroundColor;
    final effectiveText = customTextColor ?? textColor;

    final double fontSize = size == AppBadgeSize.sm ? 11.0 : 12.0;
    final double iconSize = size == AppBadgeSize.sm ? 12.0 : 14.0;
    final double vPadding = size == AppBadgeSize.sm ? 3.0 : 5.0;
    final double hPadding = size == AppBadgeSize.sm ? 8.0 : 10.0;

    return Container(
      padding: EdgeInsets.symmetric(horizontal: hPadding, vertical: vPadding),
      decoration: BoxDecoration(
        color: effectiveBg,
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: Border.all(color: effectiveText.withValues(alpha: 0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDot) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: effectiveText,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 5),
          ] else if (leadingIcon != null) ...[
            Icon(leadingIcon, size: iconSize, color: effectiveText),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: FontWeight.w700,
              color: effectiveText,
            ),
          ),
        ],
      ),
    );
  }
}
