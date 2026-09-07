import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class GuardLogoutDialog extends StatelessWidget {
  const GuardLogoutDialog({super.key});

  static Future<bool?> show(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (ctx) => const GuardLogoutDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Log Out of Guard Terminal?'),
      content: const Text(
        'Are you sure you want to end your session and log out? You will need to enter your credentials to log back in.',
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.error,
            foregroundColor: Colors.white,
          ),
          onPressed: () => Navigator.pop(context, true),
          child: const Text('Log Out'),
        ),
      ],
    );
  }
}
