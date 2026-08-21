import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class AccountInfoStep extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController nameController;
  final TextEditingController emailController;
  final TextEditingController phoneController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final bool obscurePassword;
  final VoidCallback onToggleObscure;
  final VoidCallback onNext;

  const AccountInfoStep({
    super.key,
    required this.formKey,
    required this.nameController,
    required this.emailController,
    required this.phoneController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.obscurePassword,
    required this.onToggleObscure,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Account Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          const SizedBox(height: 4),
          const Text('Enter your basic profile and login credentials', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.lg),

          TextFormField(
            controller: nameController,
            decoration: const InputDecoration(
              labelText: 'Full Name',
              hintText: 'e.g. Rahul Sharma',
              prefixIcon: Icon(Icons.person_rounded),
            ),
            validator: (v) => v == null || v.trim().isEmpty ? 'Please enter your full name' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          TextFormField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Email Address',
              hintText: 'name@example.com',
              prefixIcon: Icon(Icons.email_rounded),
            ),
            validator: (v) => v == null || !v.contains('@') ? 'Enter a valid email address' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          TextFormField(
            controller: phoneController,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              labelText: 'Mobile Phone Number',
              hintText: '+91 9876543210',
              prefixIcon: Icon(Icons.phone_rounded),
            ),
            validator: (v) => v == null || v.trim().length < 10 ? 'Enter a valid 10-digit mobile number' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          TextFormField(
            controller: passwordController,
            obscureText: obscurePassword,
            decoration: InputDecoration(
              labelText: 'Password',
              prefixIcon: const Icon(Icons.lock_rounded),
              suffixIcon: IconButton(
                icon: Icon(obscurePassword ? Icons.visibility_off_rounded : Icons.visibility_rounded),
                onPressed: onToggleObscure,
              ),
            ),
            validator: (v) => v == null || v.length < 6 ? 'Password must be at least 6 characters' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          TextFormField(
            controller: confirmPasswordController,
            obscureText: obscurePassword,
            decoration: const InputDecoration(
              labelText: 'Confirm Password',
              prefixIcon: Icon(Icons.lock_outline_rounded),
            ),
            validator: (v) {
              if (v != passwordController.text) return 'Passwords do not match';
              return null;
            },
          ),
          const SizedBox(height: AppSpacing.xl),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                if (formKey.currentState?.validate() ?? false) {
                  onNext();
                }
              },
              child: const Text('Next: Select Home & Society'),
            ),
          ),
        ],
      ),
    );
  }
}
