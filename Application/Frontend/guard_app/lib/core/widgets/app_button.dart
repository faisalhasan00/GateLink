import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

enum AppButtonVariant { primary, secondary, outline, danger, ghost }
enum AppButtonSize { sm, md, lg }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? leadingIcon;
  final IconData? trailingIcon;
  final double? width;
  final double? height;

  const AppButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = true,
    this.leadingIcon,
    this.trailingIcon,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final double defaultHeight = switch (size) {
      AppButtonSize.sm => 38.0,
      AppButtonSize.md => 48.0,
      AppButtonSize.lg => 54.0,
    };

    final double fontSize = switch (size) {
      AppButtonSize.sm => 13.0,
      AppButtonSize.md => 15.0,
      AppButtonSize.lg => 16.0,
    };

    final double iconSize = switch (size) {
      AppButtonSize.sm => 16.0,
      AppButtonSize.md => 18.0,
      AppButtonSize.lg => 20.0,
    };

    final isInteractive = onPressed != null && !isLoading;

    Color backgroundColor;
    Color textColor;
    BorderSide? borderSide;

    switch (variant) {
      case AppButtonVariant.primary:
        backgroundColor = isInteractive ? AppColors.primary : AppColors.primary.withValues(alpha: 0.5);
        textColor = Colors.white;
        borderSide = null;
        break;
      case AppButtonVariant.secondary:
        backgroundColor = isInteractive ? AppColors.primarySurface : AppColors.primarySurface.withValues(alpha: 0.5);
        textColor = isInteractive ? AppColors.primary : AppColors.primary.withValues(alpha: 0.5);
        borderSide = null;
        break;
      case AppButtonVariant.outline:
        backgroundColor = Colors.transparent;
        textColor = isInteractive ? AppColors.textPrimary : AppColors.textDisabled;
        borderSide = BorderSide(color: isInteractive ? AppColors.border : AppColors.border.withValues(alpha: 0.5));
        break;
      case AppButtonVariant.danger:
        backgroundColor = isInteractive ? AppColors.error : AppColors.error.withValues(alpha: 0.5);
        textColor = Colors.white;
        borderSide = null;
        break;
      case AppButtonVariant.ghost:
        backgroundColor = Colors.transparent;
        textColor = isInteractive ? AppColors.primary : AppColors.textDisabled;
        borderSide = null;
        break;
    }

    final child = Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: iconSize,
            height: iconSize,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(textColor),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
        ] else if (leadingIcon != null) ...[
          Icon(leadingIcon, size: iconSize, color: textColor),
          const SizedBox(width: AppSpacing.xs),
        ],
        Text(
          text,
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        if (!isLoading && trailingIcon != null) ...[
          const SizedBox(width: AppSpacing.xs),
          Icon(trailingIcon, size: iconSize, color: textColor),
        ],
      ],
    );

    return SizedBox(
      width: isFullWidth ? (width ?? double.infinity) : width,
      height: height ?? defaultHeight,
      child: ElevatedButton(
        onPressed: isInteractive ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          elevation: 0,
          shadowColor: Colors.transparent,
          side: borderSide,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.lg),
          ),
          padding: EdgeInsets.symmetric(
            horizontal: size == AppButtonSize.sm ? AppSpacing.sm : AppSpacing.md,
          ),
        ),
        child: child,
      ),
    );
  }
}
