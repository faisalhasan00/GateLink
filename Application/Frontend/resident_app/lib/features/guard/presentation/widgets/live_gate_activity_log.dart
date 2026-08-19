import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class LiveGateActivityFilterPills extends StatelessWidget {
  final String selectedFilter;
  final ValueChanged<String> onFilterSelected;

  const LiveGateActivityFilterPills({
    super.key,
    required this.selectedFilter,
    required this.onFilterSelected,
  });

  static const filters = ['All', 'Inside', 'Pending', 'Delivery', 'Cab'];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 36,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: filters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final filter = filters[index];
          final isSelected = filter == selectedFilter;

          return ChoiceChip(
            label: Text(
              filter,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? Colors.white : AppColors.textSecondary,
              ),
            ),
            selected: isSelected,
            selectedColor: AppColors.primary,
            backgroundColor: Colors.white,
            side: BorderSide(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            onSelected: (_) => onFilterSelected(filter),
          );
        },
      ),
    );
  }
}
