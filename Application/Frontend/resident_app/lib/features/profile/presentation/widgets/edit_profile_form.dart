import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class EditProfileForm extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController emailController;
  final TextEditingController dobController;
  final String selectedGender;
  final ValueChanged<String> onGenderChanged;
  final VoidCallback onPickDob;

  const EditProfileForm({
    super.key,
    required this.nameController,
    required this.emailController,
    required this.dobController,
    required this.selectedGender,
    required this.onGenderChanged,
    required this.onPickDob,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Reusable AppTextField for Full Name
        AppTextField(
          label: 'Full Name',
          isRequired: true,
          controller: nameController,
          hintText: 'Enter full name',
          prefixIcon: Icons.person_outline_rounded,
          validator: (v) =>
              v == null || v.trim().isEmpty ? 'Full name is required' : null,
        ),
        const SizedBox(height: AppSpacing.md),

        // Reusable AppTextField for Email Address
        AppTextField(
          label: 'Email Address',
          isRequired: true,
          controller: emailController,
          keyboardType: TextInputType.emailAddress,
          hintText: 'Enter email address',
          prefixIcon: Icons.email_outlined,
          validator: (v) {
            if (v == null || v.trim().isEmpty) return 'Email is required';
            if (!v.contains('@')) return 'Enter a valid email address';
            return null;
          },
        ),
        const SizedBox(height: AppSpacing.md),

        // Gender & DOB Row
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Gender',
                      style: TextStyle(
                          fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: ['Male', 'Female', 'Other'].contains(selectedGender)
                        ? selectedGender
                        : 'Male',
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppRadius.md)),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 14),
                    ),
                    items: ['Male', 'Female', 'Other']
                        .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                        .toList(),
                    onChanged: (v) {
                      if (v != null) onGenderChanged(v);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: GestureDetector(
                onTap: onPickDob,
                child: AbsorbPointer(
                  child: AppTextField(
                    label: 'Date of Birth',
                    controller: dobController,
                    hintText: 'DD MMM YYYY',
                    prefixIcon: Icons.calendar_today_rounded,
                    readOnly: true,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
