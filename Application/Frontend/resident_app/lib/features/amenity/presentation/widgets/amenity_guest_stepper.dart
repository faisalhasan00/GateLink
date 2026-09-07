import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AmenityGuestStepper extends StatelessWidget {
  final int guestCount;
  final int maxCapacity;
  final ValueChanged<int> onGuestCountChanged;

  const AmenityGuestStepper({
    super.key,
    required this.guestCount,
    required this.maxCapacity,
    required this.onGuestCountChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.group_outlined,
              color: Color(0xFF1E3A8A),
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Number of Persons',
                style: TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              Text(
                'Max allowed: $maxCapacity guests',
                style: const TextStyle(
                  fontSize: 11,
                  color: Color(0xFF64748B),
                ),
              ),
            ],
          ),
          const Spacer(),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFCBD5E1)),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.remove, size: 16),
                  onPressed: guestCount > 1
                      ? () {
                          HapticFeedback.selectionClick();
                          onGuestCountChanged(guestCount - 1);
                        }
                      : null,
                ),
                Text(
                  '$guestCount',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.add, size: 16),
                  onPressed: guestCount < maxCapacity
                      ? () {
                          HapticFeedback.selectionClick();
                          onGuestCountChanged(guestCount + 1);
                        }
                      : null,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
