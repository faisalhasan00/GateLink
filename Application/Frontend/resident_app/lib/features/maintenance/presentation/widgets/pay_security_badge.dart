import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class PaySecurityBadge extends StatelessWidget {
  const PaySecurityBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.lock_rounded, size: 14, color: AppColors.textSecondary),
          SizedBox(width: 4),
          Text(
            'Secured by 256-bit SSL encryption',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
