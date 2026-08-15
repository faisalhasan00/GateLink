import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class EntryVehicleSelector extends StatelessWidget {
  final TextEditingController vehicleController;
  final String selectedVehicleType;
  final List<String> vehicleTypes;
  final ValueChanged<String> onVehicleTypeChanged;

  const EntryVehicleSelector({
    super.key,
    required this.vehicleController,
    required this.selectedVehicleType,
    required this.vehicleTypes,
    required this.onVehicleTypeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: AppTextField(
            label: 'Vehicle Number',
            controller: vehicleController,
            hintText: 'e.g. DL 01 AB 1234',
            prefixIcon: Icons.directions_car_outlined,
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          flex: 2,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Type',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                isExpanded: true,
                value: selectedVehicleType,
                decoration: InputDecoration(
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                ),
                items: vehicleTypes
                    .map((v) => DropdownMenuItem(
                          value: v,
                          child: Text(
                            v,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 12),
                          ),
                        ))
                    .toList(),
                onChanged: (v) {
                  if (v != null) onVehicleTypeChanged(v);
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}
