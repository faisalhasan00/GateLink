import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class RegisterAccountStep extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController nameController;
  final TextEditingController emailController;
  final TextEditingController phoneController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final VoidCallback onNext;

  const RegisterAccountStep({
    super.key,
    required this.formKey,
    required this.nameController,
    required this.emailController,
    required this.phoneController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Create Account',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Enter your details to register as a resident',
            style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.xl),

          // Reusable Full Name Field
          AppTextField(
            label: 'Full Name',
            isRequired: true,
            controller: nameController,
            hintText: 'e.g. Faisal Hasan',
            prefixIcon: Icons.person_outline_rounded,
            validator: (v) =>
                v == null || v.trim().isEmpty ? 'Full name is required' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          // Reusable Email Address Field
          AppTextField(
            label: 'Email Address',
            isRequired: true,
            controller: emailController,
            hintText: 'name@example.com',
            keyboardType: TextInputType.emailAddress,
            prefixIcon: Icons.email_outlined,
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Email is required';
              if (!v.contains('@') || !v.contains('.')) {
                return 'Enter a valid email address';
              }
              return null;
            },
          ),
          const SizedBox(height: AppSpacing.md),

          // Reusable Mobile Number Field
          AppTextField(
            label: 'Mobile Number',
            isRequired: true,
            controller: phoneController,
            hintText: '+91 98765 43210',
            keyboardType: TextInputType.phone,
            prefixIcon: Icons.phone_outlined,
            validator: (v) =>
                v == null || v.trim().isEmpty ? 'Phone number is required' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          // Reusable Password Field
          AppTextField(
            label: 'Password',
            isRequired: true,
            controller: passwordController,
            isPassword: true,
            hintText: '••••••••',
            prefixIcon: Icons.lock_outline_rounded,
            validator: (v) {
              if (v == null || v.length < 6) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: AppSpacing.md),

          // Reusable Confirm Password Field
          AppTextField(
            label: 'Confirm Password',
            isRequired: true,
            controller: confirmPasswordController,
            isPassword: true,
            hintText: '••••••••',
            prefixIcon: Icons.lock_outline_rounded,
            validator: (v) {
              if (v != passwordController.text) {
                return 'Passwords do not match';
              }
              return null;
            },
          ),
          const SizedBox(height: AppSpacing.xxl),

          // Reusable AppButton
          AppButton(
            text: 'Next: Select Location & Society ➔',
            size: AppButtonSize.lg,
            onPressed: () {
              if (formKey.currentState!.validate()) {
                onNext();
              }
            },
          ),
        ],
      ),
    );
  }
}
