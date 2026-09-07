import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class QuickEntryVisitorForm extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController phoneController;
  final TextEditingController vehicleController;
  final String selectedVehicleType;
  final List<String> vehicleTypes;
  final ValueChanged<String?> onVehicleTypeChanged;

  const QuickEntryVisitorForm({
    super.key,
    required this.nameController,
    required this.phoneController,
    required this.vehicleController,
    required this.selectedVehicleType,
    required this.vehicleTypes,
    required this.onVehicleTypeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: nameController,
          decoration: const InputDecoration(
            labelText: 'Visitor Full Name',
            hintText: 'e.g. Ramesh Kumar',
            prefixIcon: Icon(Icons.person_outline_rounded),
          ),
          validator: (v) => v == null || v.trim().isEmpty ? 'Visitor name is required' : null,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: phoneController,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(
            labelText: 'Visitor Mobile Number',
            hintText: 'e.g. 9876543210',
            prefixIcon: Icon(Icons.phone_outlined),
          ),
          validator: (v) => v == null || v.trim().length < 10 ? 'Enter valid 10-digit phone' : null,
        ),
        const SizedBox(height: AppSpacing.md),
        Row(
          children: [
            Expanded(
              flex: 4,
              child: DropdownButtonFormField<String>(
                value: selectedVehicleType,
                decoration: const InputDecoration(labelText: 'Vehicle Type'),
                items: vehicleTypes
                    .map((v) => DropdownMenuItem(value: v, child: Text(v, style: const TextStyle(fontSize: 12))))
                    .toList(),
                onChanged: onVehicleTypeChanged,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              flex: 5,
              child: TextFormField(
                controller: vehicleController,
                decoration: const InputDecoration(
                  labelText: 'Vehicle Number',
                  hintText: 'e.g. TS09AB1234',
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
