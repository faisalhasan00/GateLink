import 'package:flutter/material.dart';

/// Single circular action button (Deny, Leave at Gate, Allow) with label text below
class ApprovalDialogActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color buttonColor;
  final Color borderColor;
  final Color iconColor;
  final Color textColor;
  final VoidCallback onPressed;
  final bool isSolid;

  const ApprovalDialogActionButton({
    super.key,
    required this.label,
    required this.icon,
    required this.buttonColor,
    required this.borderColor,
    required this.iconColor,
    required this.textColor,
    required this.onPressed,
    this.isSolid = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onPressed,
            borderRadius: BorderRadius.circular(32),
            child: Ink(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                color: buttonColor,
                shape: BoxShape.circle,
                border: Border.all(color: borderColor, width: 2),
                boxShadow: isSolid
                    ? [
                        BoxShadow(
                          color: borderColor.withValues(alpha: 0.35),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ]
                    : null,
              ),
              child: Icon(
                icon,
                color: iconColor,
                size: 28,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: textColor,
            letterSpacing: 0.4,
            height: 1.2,
          ),
        ),
      ],
    );
  }
}
