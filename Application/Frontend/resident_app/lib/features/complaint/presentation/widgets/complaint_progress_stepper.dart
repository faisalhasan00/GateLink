import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/complaint_model.dart';

class ComplaintProgressStepper extends StatelessWidget {
  final int currentStep;
  final ComplaintModel complaint;
  final String Function(String) formatDate;

  const ComplaintProgressStepper({
    super.key,
    required this.currentStep,
    required this.complaint,
    required this.formatDate,
  });

  @override
  Widget build(BuildContext context) {
    final steps = [
      {'title': 'Ticket Raised', 'desc': formatDate(complaint.createdAt)},
      {
        'title': 'Assigned',
        'desc': complaint.assignedTo != null
            ? 'Assigned to ${complaint.assignedTo}'
            : 'Pending assignment'
      },
      {'title': 'In Progress', 'desc': 'Technician working on-site'},
      {'title': 'Resolved', 'desc': 'Fixed & verified'},
    ];

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'RESOLUTION PROGRESS',
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.8,
              color: Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 16),
          Column(
            children: List.generate(steps.length, (index) {
              final isCompleted = index < currentStep;
              final isCurrent = index == currentStep;
              final isPending = index > currentStep;
              final isLast = index == steps.length - 1;

              Color dotColor;
              Color lineColor;

              if (isCompleted || isCurrent) {
                dotColor = isCompleted
                    ? const Color(0xFF10B981)
                    : (currentStep == 3
                        ? const Color(0xFF10B981)
                        : const Color(0xFF1E3A8A));
                lineColor = isCompleted
                    ? const Color(0xFF10B981)
                    : const Color(0xFFE2E8F0);
              } else {
                dotColor = const Color(0xFFCBD5E1);
                lineColor = const Color(0xFFE2E8F0);
              }

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: isCompleted
                              ? const Color(0xFF10B981)
                              : isCurrent
                                  ? dotColor
                                  : Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: dotColor,
                            width: 2,
                          ),
                        ),
                        child: Center(
                          child: isCompleted
                              ? const Icon(Icons.check_rounded,
                                  size: 14, color: Colors.white)
                              : isCurrent
                                  ? Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                      ),
                                    )
                                  : null,
                        ),
                      ),
                      if (!isLast)
                        Container(
                          width: 2,
                          height: 36,
                          color: lineColor,
                        ),
                    ],
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            steps[index]['title']!,
                            style: TextStyle(
                              fontSize: 13.5,
                              fontWeight: isCurrent || isCompleted
                                  ? FontWeight.w800
                                  : FontWeight.w600,
                              color: isPending
                                  ? const Color(0xFF94A3B8)
                                  : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            steps[index]['desc']!,
                            style: TextStyle(
                              fontSize: 11.5,
                              color: isPending
                                  ? const Color(0xFFCBD5E1)
                                  : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            }),
          ),
        ],
      ),
    );
  }
}
