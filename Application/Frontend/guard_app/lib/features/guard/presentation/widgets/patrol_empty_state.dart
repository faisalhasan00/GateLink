import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class PatrolEmptyState extends StatelessWidget {
  const PatrolEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.qr_code_2_rounded, size: 54, color: AppColors.gray400),
          SizedBox(height: 12),
          Text(
            'No Patrol Checkpoints Configured',
            style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.textSecondary),
          ),
          SizedBox(height: 4),
          Text(
            'Society admin can configure checkpoints from the admin web portal.',
            style: TextStyle(fontSize: 12, color: AppColors.gray400),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
