import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class PassTypeSelector extends StatelessWidget {
  final String passType; // 'one_time' or 'multi_day'
  final ValueChanged<String> onPassTypeChanged;

  const PassTypeSelector({
    super.key,
    required this.passType,
    required this.onPassTypeChanged,
  });

  @override
  Widget build(BuildContext context) {
    final isSingle = passType == 'one_time';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'SELECT PASS TYPE',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.8,
            color: Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: const Color(0xFFE2E8F0),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => onPassTypeChanged('one_time'),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: isSingle ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: isSingle
                          ? [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.08),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              )
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.timer_outlined,
                          size: 18,
                          color: isSingle
                              ? const Color(0xFF1E3A8A)
                              : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'One-Time Pass',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: isSingle
                                ? FontWeight.w800
                                : FontWeight.w600,
                            color: isSingle
                                ? const Color(0xFF1E3A8A)
                                : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () => onPassTypeChanged('multi_day'),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: !isSingle ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: !isSingle
                          ? [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.08),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              )
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.date_range_rounded,
                          size: 18,
                          color: !isSingle
                              ? const Color(0xFF0EA5E9)
                              : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Multi-Day Stay',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: !isSingle
                                ? FontWeight.w800
                                : FontWeight.w600,
                            color: !isSingle
                                ? const Color(0xFF0EA5E9)
                                : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Policy Info Banner
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: isSingle ? const Color(0xFFEFF6FF) : const Color(0xFFFEF3C7),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSingle ? const Color(0xFFBFDBFE) : const Color(0xFFFDE68A),
            ),
          ),
          child: Row(
            children: [
              Icon(
                isSingle ? Icons.info_outline_rounded : Icons.verified_user_outlined,
                size: 18,
                color: isSingle ? const Color(0xFF1D4ED8) : const Color(0xFFB45309),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  isSingle
                      ? 'Single-Use: Generates a 6-digit OTP that auto-expires once entry is recorded at the gate.'
                      : 'Multi-Entry: Allows authorized check-in & check-out across the selected date range.',
                  style: TextStyle(
                    fontSize: 12,
                    color: isSingle ? const Color(0xFF1E40AF) : const Color(0xFF92400E),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
