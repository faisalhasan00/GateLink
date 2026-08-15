import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../models/gate_entry_model.dart';

class EntryCategorySelector extends StatelessWidget {
  final EntryType selectedType;
  final ValueChanged<EntryType> onTypeChanged;

  const EntryCategorySelector({
    super.key,
    required this.selectedType,
    required this.onTypeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select Entry Category',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Row(
          children: EntryType.values.map((type) {
            final isSelected = selectedType == type;
            final model = GateEntryModel(
              id: '',
              visitorName: '',
              phone: '',
              flatNumber: '',
              tower: '',
              status: EntryStatus.inside,
              entryTime: DateTime.now(),
              type: type,
            );
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: GestureDetector(
                  onTap: () => onTypeChanged(type),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.secondary : Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(
                        color:
                            isSelected ? AppColors.secondary : AppColors.border,
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          model.typeIcon,
                          color: isSelected
                              ? Colors.white
                              : AppColors.textSecondary,
                          size: 22,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          type.name.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: isSelected
                                ? Colors.white
                                : AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
