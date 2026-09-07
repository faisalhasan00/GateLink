import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_text_field.dart';

class ResidentFormFields extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController flatController;
  final TextEditingController emailController;
  final TextEditingController phoneController;
  final String userType;
  final ValueChanged<String> onUserTypeChanged;

  const ResidentFormFields({
    super.key,
    required this.nameController,
    required this.flatController,
    required this.emailController,
    required this.phoneController,
    required this.userType,
    required this.onUserTypeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AppTextField(
          controller: nameController,
          label: 'Full Name *',
          hintText: 'e.g. Arjun Kumar',
          validator: (val) =>
              val == null || val.trim().isEmpty ? 'Name is required' : null,
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            Expanded(
              flex: 3,
              child: AppTextField(
                controller: flatController,
                label: 'Flat / Unit *',
                hintText: 'e.g. A-101',
                validator: (val) => val == null || val.trim().isEmpty
                    ? 'Flat is required'
                    : null,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Type',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.cardBorder),
                      borderRadius: BorderRadius.circular(10),
                      color: AppColors.surface,
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: userType,
                        isExpanded: true,
                        items: const [
                          DropdownMenuItem(
                              value: 'owner', child: Text('Owner')),
                          DropdownMenuItem(
                              value: 'tenant', child: Text('Tenant')),
                        ],
                        onChanged: (val) {
                          if (val != null) {
                            onUserTypeChanged(val);
                          }
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        AppTextField(
          controller: emailController,
          label: 'Email Address *',
          hintText: 'resident@email.com',
          keyboardType: TextInputType.emailAddress,
          validator: (val) {
            if (val == null || val.trim().isEmpty) {
              return 'Email is required';
            }
            if (!val.contains('@')) return 'Invalid email address';
            return null;
          },
        ),
        const SizedBox(height: 14),
        AppTextField(
          controller: phoneController,
          label: 'Mobile Number *',
          hintText: '+91 98765 43210',
          keyboardType: TextInputType.phone,
          validator: (val) => val == null || val.trim().isEmpty
              ? 'Phone is required'
              : null,
        ),
      ],
    );
  }
}
