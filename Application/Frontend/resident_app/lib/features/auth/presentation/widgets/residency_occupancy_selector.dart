import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ResidencyOccupancySelector extends StatelessWidget {
  final String selectedOccupancy;
  final ValueChanged<String> onOccupancyChanged;

  const ResidencyOccupancySelector({
    super.key,
    required this.selectedOccupancy,
    required this.onOccupancyChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 6),
          child: Text(
            'CURRENT OCCUPANCY',
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
              'Currently residing',
              'Flat is let out',
              'Flat is empty',
            ].map((status) {
              final isSelected = selectedOccupancy == status;
              return RadioListTile<String>(
                title: Text(
                  status,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
                value: status,
                groupValue: selectedOccupancy,
                activeColor: AppColors.primary,
                onChanged: (val) {
                  if (val != null) onOccupancyChanged(val);
                },
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
