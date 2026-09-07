import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_spacing.dart';

class DeliveryInstructionChips extends StatelessWidget {
  final String? selectedInstruction;
  final ValueChanged<String?> onInstructionChanged;

  const DeliveryInstructionChips({
    super.key,
    required this.selectedInstruction,
    required this.onInstructionChanged,
  });

  static const List<Map<String, dynamic>> instructionOptions = [
    {'label': 'Leave at Door', 'icon': Icons.door_front_door_outlined},
    {'label': 'Leave at Gate', 'icon': Icons.shield_outlined},
    {'label': 'Collect OTP at Door', 'icon': Icons.pin_outlined},
    {'label': 'Don\'t Ring Bell', 'icon': Icons.notifications_off_outlined},
    {'label': 'Call on Arrival', 'icon': Icons.call_outlined},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'DELIVERY & GATE INSTRUCTIONS',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.8,
            color: Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: instructionOptions.map((opt) {
            final label = opt['label'] as String;
            final icon = opt['icon'] as IconData;
            final isSelected = selectedInstruction == label;

            return FilterChip(
              avatar: Icon(
                icon,
                size: 14,
                color: isSelected ? Colors.white : const Color(0xFF1E3A8A),
              ),
              label: Text(label),
              selected: isSelected,
              onSelected: (selected) {
                HapticFeedback.selectionClick();
                onInstructionChanged(selected ? label : null);
              },
              selectedColor: const Color(0xFF1E3A8A),
              labelStyle: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isSelected ? Colors.white : const Color(0xFF334155),
              ),
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: BorderSide(
                  color: isSelected ? Colors.transparent : const Color(0xFFCBD5E1),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
