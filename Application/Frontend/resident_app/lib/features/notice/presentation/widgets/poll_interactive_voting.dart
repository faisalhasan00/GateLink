import 'package:flutter/material.dart';
import '../../domain/models/poll_model.dart';

class PollInteractiveVoting extends StatelessWidget {
  final PollModel poll;
  final String? selectedOptionId;
  final bool canVote;
  final ValueChanged<String> onOptionSelected;

  const PollInteractiveVoting({
    super.key,
    required this.poll,
    required this.selectedOptionId,
    required this.canVote,
    required this.onOptionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: poll.options.map((opt) {
        final isSelected = selectedOptionId == opt.id;

        return GestureDetector(
          onTap: () {
            if (canVote) {
              onOptionSelected(opt.id);
            }
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFCBD5E1),
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                  color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFF94A3B8),
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    opt.text,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFF1E293B),
                    ),
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
