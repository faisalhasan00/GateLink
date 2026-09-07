import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class VisitorHistoryEmptyState extends StatelessWidget {
  const VisitorHistoryEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.history_toggle_off_rounded, size: 54, color: AppColors.gray300),
          SizedBox(height: 12),
          Text(
            'No Visitor History Available',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Try adjusting search or filter options',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
