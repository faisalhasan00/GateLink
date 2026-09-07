import 'package:flutter/material.dart';
import '../../../../core/models/resident_model.dart';
import '../../../../core/theme/app_colors.dart';

class BillingResidentDropdown extends StatelessWidget {
  final List<ResidentModel> residents;
  final String? selectedResidentId;
  final ValueChanged<String?> onResidentSelected;

  const BillingResidentDropdown({
    super.key,
    required this.residents,
    required this.selectedResidentId,
    required this.onResidentSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select Flat / Resident *',
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.cardBorder),
            borderRadius: BorderRadius.circular(10),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: selectedResidentId,
              isExpanded: true,
              hint: const Text('Choose Flat'),
              items: residents.map((r) {
                return DropdownMenuItem(
                  value: r.id,
                  child: Text('Flat ${r.flatNo} - ${r.name}'),
                );
              }).toList(),
              onChanged: onResidentSelected,
            ),
          ),
        ),
      ],
    );
  }
}
