import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ResidentTypeSelector extends StatelessWidget {
  final String selectedYouAre;
  final ValueChanged<String> onYouAreChanged;

  const ResidentTypeSelector({
    super.key,
    required this.selectedYouAre,
    required this.onYouAreChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 6),
          child: Text(
            'YOU ARE',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.gray300),
          ),
          child: Column(
            children: [
              'Flat Owner',
              'Renting with family',
              'Renting with other flatmates',
            ].map((type) {
              final isSelected = selectedYouAre == type;
              return RadioListTile<String>(
                title: Text(
                  type,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
                value: type,
                groupValue: selectedYouAre,
                activeColor: AppColors.primary,
                onChanged: (val) {
                  if (val != null) onYouAreChanged(val);
                },
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
