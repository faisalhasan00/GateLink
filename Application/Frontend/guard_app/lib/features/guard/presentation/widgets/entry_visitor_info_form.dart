import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../models/gate_entry_model.dart';

class EntryVisitorInfoForm extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController phoneController;
  final TextEditingController companyController;
  final TextEditingController notesController;
  final String selectedGender;
  final List<String> genders;
  final EntryType selectedType;
  final ValueChanged<String> onGenderChanged;

  const EntryVisitorInfoForm({
    super.key,
    required this.nameController,
    required this.phoneController,
    required this.companyController,
    required this.notesController,
    required this.selectedGender,
    required this.genders,
    required this.selectedType,
    required this.onGenderChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Name & Gender Row
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: AppTextField(
                label: 'Visitor Name',
                isRequired: true,
                controller: nameController,
                hintText: 'e.g. Rahul Sharma',
                prefixIcon: Icons.person_outline_rounded,
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Name is required'
                    : null,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Gender',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: selectedGender,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                    ),
                    items: genders
                        .map((g) => DropdownMenuItem(
                              value: g,
                              child: Text(g),
                            ))
                        .toList(),
                    onChanged: (v) {
                      if (v != null) onGenderChanged(v);
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),

        // Mobile Number
        AppTextField(
          label: 'Mobile Number',
          isRequired: true,
          controller: phoneController,
          keyboardType: TextInputType.phone,
          hintText: '+91 98765 43210',
          prefixIcon: Icons.phone_outlined,
          validator: (v) => (v == null || v.trim().length < 10)
              ? 'Valid 10-digit mobile number required'
              : null,
        ),
        const SizedBox(height: AppSpacing.md),

        // Conditional Delivery / Cab Company Name
        if (selectedType == EntryType.delivery ||
            selectedType == EntryType.cab) ...[
          AppTextField(
            label: selectedType == EntryType.delivery
                ? 'Company Name'
                : 'Cab Service',
            controller: companyController,
            hintText: selectedType == EntryType.delivery
                ? 'e.g. Zomato, Amazon, Blinkit'
                : 'e.g. Uber, Ola',
            prefixIcon: Icons.local_shipping_outlined,
          ),
          const SizedBox(height: AppSpacing.md),
        ],

        // Remarks / Notes
        AppTextField(
          label: 'Remarks / Notes',
          controller: notesController,
          maxLines: 2,
          hintText: 'e.g. Carrying heavy package, verified ID card',
        ),
      ],
    );
  }
}
