import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AmenitySlotPicker extends StatelessWidget {
  final List<String> morningSlots;
  final List<String> eveningSlots;
  final Set<String> bookedSlots;
  final String? selectedSlot;
  final bool isFetchingSlots;
  final ValueChanged<String?> onSlotSelected;

  const AmenitySlotPicker({
    super.key,
    required this.morningSlots,
    required this.eveningSlots,
    required this.bookedSlots,
    required this.selectedSlot,
    required this.isFetchingSlots,
    required this.onSlotSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text(
              'AVAILABLE TIME SLOTS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                color: Color(0xFF64748B),
              ),
            ),
            const SizedBox(width: 8),
            if (isFetchingSlots)
              const SizedBox(
                width: 14,
                height: 14,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Color(0xFF1E3A8A),
                ),
              ),
          ],
        ),
        const SizedBox(height: 12),

        // Morning Slots
        const Text(
          '🌅 Morning Slots (6 AM - 11 AM)',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: Color(0xFF475569),
          ),
        ),
        const SizedBox(height: 8),
        _buildSlotsGrid(morningSlots),
        const SizedBox(height: 16),

        // Evening Slots
        const Text(
          '🌆 Evening Slots (4 PM - 9 PM)',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: Color(0xFF475569),
          ),
        ),
        const SizedBox(height: 8),
        _buildSlotsGrid(eveningSlots),
      ],
    );
  }

  Widget _buildSlotsGrid(List<String> slots) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: slots.map((slot) {
        final isBooked = bookedSlots.contains(slot);
        final isSelected = selectedSlot == slot;

        return InkWell(
          onTap: isBooked
              ? null
              : () {
                  HapticFeedback.selectionClick();
                  onSlotSelected(isSelected ? null : slot);
                },
          borderRadius: BorderRadius.circular(10),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected
                  ? const Color(0xFF1E3A8A)
                  : (isBooked ? const Color(0xFFF1F5F9) : Colors.white),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected
                    ? const Color(0xFF1E3A8A)
                    : (isBooked
                        ? const Color(0xFFE2E8F0)
                        : const Color(0xFFCBD5E1)),
                width: isSelected ? 1.5 : 1.0,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (isSelected) ...[
                  const Icon(Icons.check_circle_rounded,
                      size: 14, color: Colors.white),
                  const SizedBox(width: 6),
                ] else if (isBooked) ...[
                  const Icon(Icons.block_rounded,
                      size: 13, color: Color(0xFF94A3B8)),
                  const SizedBox(width: 6),
                ],
                Text(
                  slot,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                    decoration: isBooked ? TextDecoration.lineThrough : null,
                    color: isSelected
                        ? Colors.white
                        : (isBooked
                            ? const Color(0xFF94A3B8)
                            : const Color(0xFF0F172A)),
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
