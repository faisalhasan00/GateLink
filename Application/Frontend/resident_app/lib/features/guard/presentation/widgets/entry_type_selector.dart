import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../models/gate_entry_model.dart';

class EntryTypeSelector extends StatelessWidget {
  final EntryType selectedType;
  final ValueChanged<EntryType> onTypeSelected;

  const EntryTypeSelector({
    super.key,
    required this.selectedType,
    required this.onTypeSelected,
  });

  @override
  Widget build(BuildContext context) {
    final types = [
      {'type': EntryType.guest, 'label': 'Guest', 'icon': Icons.person_rounded},
      {'type': EntryType.delivery, 'label': 'Delivery', 'icon': Icons.local_shipping_rounded},
      {'type': EntryType.cab, 'label': 'Cab / Taxi', 'icon': Icons.local_taxi_rounded},
      {'type': EntryType.service, 'label': 'Daily Help', 'icon': Icons.cleaning_services_rounded},
    ];

    return Row(
      children: types.map((item) {
        final type = item['type'] as EntryType;
        final isSelected = selectedType == type;
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.only(right: 6.0),
            child: GestureDetector(
              onTap: () => onTypeSelected(type),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.secondary : Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: isSelected ? AppColors.secondary : AppColors.border),
                ),
                child: Column(
                  children: [
                    Icon(item['icon'] as IconData, color: isSelected ? Colors.white : AppColors.textSecondary, size: 20),
                    const SizedBox(height: 4),
                    Text(
                      item['label'] as String,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        color: isSelected ? Colors.white : AppColors.textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
