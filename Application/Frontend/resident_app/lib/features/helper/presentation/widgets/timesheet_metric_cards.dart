import 'package:flutter/material.dart';

class TimesheetMetricCards extends StatelessWidget {
  final int presentDays;
  final int absentDays;
  final double totalHours;
  final double netPayable;

  const TimesheetMetricCards({
    super.key,
    required this.presentDays,
    required this.absentDays,
    required this.totalHours,
    required this.netPayable,
  });

  Widget _buildMetricCard({
    required String title,
    required String value,
    required Color color,
    required Color bgColor,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style:
                        TextStyle(fontSize: 11, color: Colors.grey.shade700)),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                title: 'Present',
                value: '$presentDays Days',
                color: const Color(0xFF10B981),
                bgColor: const Color(0xFFDCFCE7),
                icon: Icons.check_circle_rounded,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildMetricCard(
                title: 'Absent',
                value: '$absentDays Days',
                color: const Color(0xFFEF4444),
                bgColor: const Color(0xFFFEE2E2),
                icon: Icons.cancel_rounded,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                title: 'Duty Hours',
                value: '${totalHours.toStringAsFixed(1)} hrs',
                color: const Color(0xFF0EA5E9),
                bgColor: const Color(0xFFE0F2FE),
                icon: Icons.access_time_filled_rounded,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildMetricCard(
                title: 'Net Payable',
                value: '₹${netPayable.toStringAsFixed(0)}',
                color: const Color(0xFF1E3A8A),
                bgColor: const Color(0xFFEFF6FF),
                icon: Icons.account_balance_wallet_rounded,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
