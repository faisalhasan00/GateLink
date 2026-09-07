import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorSchedulePicker extends StatelessWidget {
  final bool isSingle;
  final DateTime singleDate;
  final TimeOfDay? singleTime;
  final DateTime multiFromDate;
  final DateTime multiUntilDate;
  final VoidCallback onPickSingleDate;
  final VoidCallback onPickSingleTime;
  final VoidCallback onPickDateRange;

  const VisitorSchedulePicker({
    super.key,
    required this.isSingle,
    required this.singleDate,
    required this.singleTime,
    required this.multiFromDate,
    required this.multiUntilDate,
    required this.onPickSingleDate,
    required this.onPickSingleTime,
    required this.onPickDateRange,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isSingle ? 'EXPECTED ENTRY TIME' : 'VALIDITY DATE RANGE',
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.8,
            color: Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        if (isSingle)
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: onPickSingleDate,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFCBD5E1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Date', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_rounded, size: 14, color: Color(0xFF1E3A8A)),
                            const SizedBox(width: 6),
                            Text(
                              DateFormat('dd MMM yyyy').format(singleDate),
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: InkWell(
                  onTap: onPickSingleTime,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFCBD5E1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Time Window', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            const Icon(Icons.access_time_rounded, size: 14, color: Color(0xFF1E3A8A)),
                            const SizedBox(width: 6),
                            Text(
                              singleTime != null ? singleTime!.format(context) : 'Anytime Today',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          )
        else
          InkWell(
            onTap: onPickDateRange,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFCBD5E1)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.date_range_rounded, color: Color(0xFF0EA5E9)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Valid Stay Period', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        const SizedBox(height: 2),
                        Text(
                          '${DateFormat('dd MMM yyyy').format(multiFromDate)}  ➔  ${DateFormat('dd MMM yyyy').format(multiUntilDate)}',
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0F2FE),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '${multiUntilDate.difference(multiFromDate).inDays + 1} Days',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF0369A1)),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
