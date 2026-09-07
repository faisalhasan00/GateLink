import 'package:flutter/material.dart';

class TimesheetMonthSelector extends StatelessWidget {
  final String monthLabel;
  final VoidCallback onPreviousMonth;
  final VoidCallback onNextMonth;

  const TimesheetMonthSelector({
    super.key,
    required this.monthLabel,
    required this.onPreviousMonth,
    required this.onNextMonth,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left_rounded,
                size: 28, color: Color(0xFF1E3A8A)),
            onPressed: onPreviousMonth,
          ),
          Row(
            children: [
              const Icon(Icons.calendar_month_rounded,
                  color: Color(0xFF0EA5E9), size: 20),
              const SizedBox(width: 8),
              Text(
                monthLabel,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E293B),
                ),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right_rounded,
                size: 28, color: Color(0xFF1E3A8A)),
            onPressed: onNextMonth,
          ),
        ],
      ),
    );
  }
}
