import 'package:flutter/material.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class BuildingBlockSelector extends StatelessWidget {
  final SocietyModel? selectedSocietyModel;
  final String selectedBuilding;
  final ValueChanged<String> onBuildingChanged;

  const BuildingBlockSelector({
    super.key,
    required this.selectedSocietyModel,
    required this.selectedBuilding,
    required this.onBuildingChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 6),
          child: Text(
            'SELECT BUILDING / BLOCK',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        (selectedSocietyModel == null || selectedSocietyModel!.blocks.isEmpty)
            ? Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.gray300),
                ),
                child: const Text(
                  'Select a society above to view building blocks',
                  style:
                      TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
              )
            : Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.gray300),
                ),
                child: Column(
                  children: selectedSocietyModel!.blocks.map((b) {
                    final isSelected = selectedBuilding == b;
                    return ListTile(
                      dense: true,
                      leading: Icon(
                        Icons.apartment_rounded,
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.textSecondary,
                      ),
                      title: Text(
                        b,
                        style: TextStyle(
                          fontWeight: isSelected
                              ? FontWeight.w700
                              : FontWeight.w500,
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.textPrimary,
                        ),
                      ),
                      trailing: Icon(
                        isSelected
                            ? Icons.check_circle_rounded
                            : Icons.chevron_right_rounded,
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.gray400,
                      ),
                      onTap: () => onBuildingChanged(b),
                    );
                  }).toList(),
                ),
              ),
      ],
    );
  }
}
