import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

enum AppHomeMode {
  societyGate,
  localMart,
}

class ModeSwitcherToggle extends StatelessWidget {
  final AppHomeMode currentMode;
  final ValueChanged<AppHomeMode> onModeChanged;

  const ModeSwitcherToggle({
    super.key,
    required this.currentMode,
    required this.onModeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 46,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.gray100,
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          // Mode 1: Society Gate
          Expanded(
            child: GestureDetector(
              onTap: () => onModeChanged(AppHomeMode.societyGate),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: currentMode == AppHomeMode.societyGate
                      ? AppColors.primary
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  boxShadow: currentMode == AppHomeMode.societyGate
                      ? [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.25),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.apartment_rounded,
                      size: 16,
                      color: currentMode == AppHomeMode.societyGate
                          ? Colors.white
                          : AppColors.textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Society Gate',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: currentMode == AppHomeMode.societyGate
                            ? Colors.white
                            : AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Mode 2: LocalMart & Services
          Expanded(
            child: GestureDetector(
              onTap: () => onModeChanged(AppHomeMode.localMart),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: currentMode == AppHomeMode.localMart
                      ? const Color(0xFF059669) // Emerald Green
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  boxShadow: currentMode == AppHomeMode.localMart
                      ? [
                          BoxShadow(
                            color: const Color(0xFF059669).withValues(alpha: 0.3),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.storefront_rounded,
                      size: 16,
                      color: currentMode == AppHomeMode.localMart
                          ? Colors.white
                          : AppColors.textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'LocalMart',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: currentMode == AppHomeMode.localMart
                            ? Colors.white
                            : AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 5, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: currentMode == AppHomeMode.localMart
                            ? Colors.white
                            : const Color(0xFF059669),
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                      child: Text(
                        'SOON',
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.w800,
                          color: currentMode == AppHomeMode.localMart
                              ? const Color(0xFF059669)
                              : Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
