import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class RegisterProgressHeader extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const RegisterProgressHeader({
    super.key,
    required this.currentStep,
    this.totalSteps = 3,
  });

  String get _stepSubtitle {
    switch (currentStep) {
      case 1:
        return 'Personal Info';
      case 2:
        return 'Location & Flat';
      case 3:
      default:
        return 'Verification Proof';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Step $currentStep of $totalSteps',
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                  color: AppColors.primary,
                ),
              ),
              Text(
                _stepSubtitle,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: List.generate(totalSteps, (index) {
              final stepNum = index + 1;
              return Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: index < totalSteps - 1 ? 6 : 0),
                  decoration: BoxDecoration(
                    color: stepNum <= currentStep
                        ? AppColors.primary
                        : AppColors.gray200,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
