import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../domain/models/helper_attendance_day.dart';

class TimesheetCalendarCard extends StatelessWidget {
  final List<HelperAttendanceDay> attendanceDays;

  const TimesheetCalendarCard({
    super.key,
    required this.attendanceDays,
  });

  void _showDayDetailsDialog(BuildContext context, HelperAttendanceDay day) {
    final dateFormatted = DateFormat('EEEE, dd MMMM yyyy').format(day.date);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: day.isPresent
                    ? const Color(0xFFDCFCE7)
                    : const Color(0xFFFEE2E2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                day.isPresent ? Icons.check_circle_rounded : Icons.cancel_rounded,
                color: day.isPresent
                    ? const Color(0xFF16A34A)
                    : const Color(0xFFDC2626),
                size: 22,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                day.isPresent ? 'Present on Campus' : 'Absent',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: day.isPresent
                      ? const Color(0xFF16A34A)
                      : const Color(0xFFDC2626),
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              dateFormatted,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 14),
            if (day.isPresent) ...[
              _buildLogDetailRow(
                icon: Icons.login_rounded,
                iconColor: const Color(0xFF10B981),
                label: 'Entry Time',
                value: day.entryTime != null && day.entryTime!.isNotEmpty
                    ? DateFormat('hh:mm a')
                        .format(DateTime.parse(day.entryTime!))
                    : 'Recorded at Gate',
                subValue: 'Gate: ${day.entryGate ?? "Main Gate"}',
              ),
              const SizedBox(height: 10),
              _buildLogDetailRow(
                icon: Icons.logout_rounded,
                iconColor: const Color(0xFFEF4444),
                label: 'Exit Time',
                value: day.exitTime != null && day.exitTime!.isNotEmpty
                    ? DateFormat('hh:mm a')
                        .format(DateTime.parse(day.exitTime!))
                    : 'Active / Not Exited',
                subValue: day.exitGate != null ? 'Gate: ${day.exitGate}' : '',
              ),
              const SizedBox(height: 10),
              _buildLogDetailRow(
                icon: Icons.timer_outlined,
                iconColor: const Color(0xFF0EA5E9),
                label: 'Duration',
                value: day.formattedDuration,
                subValue: day.guardName != null ? 'Logged by ${day.guardName}' : '',
              ),
            ] else ...[
              const Text(
                'No gate entry or attendance activity logged for this date.',
                style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close',
                style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildLogDetailRow({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
    String subValue = '',
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 16),
        ),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label,
                style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
            Text(value,
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B))),
            if (subValue.isNotEmpty)
              Text(subValue,
                  style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
          ],
        ),
      ],
    );
  }

  Widget _buildLegendDot(Color color, String text) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(text,
            style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Monthly Attendance Calendar',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E293B),
                ),
              ),
              Row(
                children: [
                  _buildLegendDot(const Color(0xFF10B981), 'Present'),
                  const SizedBox(width: 10),
                  _buildLegendDot(const Color(0xFFEF4444), 'Absent'),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (attendanceDays.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Text('No attendance days to display',
                    style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
              ),
            )
          else
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: attendanceDays.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7,
                crossAxisSpacing: 6,
                mainAxisSpacing: 6,
                childAspectRatio: 1.0,
              ),
              itemBuilder: (ctx, idx) {
                final day = attendanceDays[idx];
                final isPresent = day.isPresent;
                final dayNumber = day.date.day;

                return InkWell(
                  onTap: () => _showDayDetailsDialog(context, day),
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isPresent
                          ? const Color(0xFFDCFCE7)
                          : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: isPresent
                            ? const Color(0xFF86EFAC)
                            : Colors.grey.shade200,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '$dayNumber',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isPresent
                                ? const Color(0xFF16A34A)
                                : const Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Icon(
                          isPresent
                              ? Icons.check_circle_rounded
                              : Icons.circle_outlined,
                          size: 12,
                          color: isPresent
                              ? const Color(0xFF16A34A)
                              : Colors.grey.shade400,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
