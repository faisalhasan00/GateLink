import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class PartnerRegisterForm extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController nameController;
  final TextEditingController phoneController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final TextEditingController emailController;
  final TextEditingController upiController;
  final TextEditingController cityController;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final String selectedCategory;
  final List<String> categories;
  final bool acceptedTerms;
  final bool isLoading;
  final VoidCallback onToggleObscurePassword;
  final VoidCallback onToggleObscureConfirmPassword;
  final ValueChanged<String> onCategoryChanged;
  final ValueChanged<bool> onTermsChanged;
  final VoidCallback onSubmit;

  const PartnerRegisterForm({
    super.key,
    required this.formKey,
    required this.nameController,
    required this.phoneController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.emailController,
    required this.upiController,
    required this.cityController,
    required this.obscurePassword,
    required this.obscureConfirmPassword,
    required this.selectedCategory,
    required this.categories,
    required this.acceptedTerms,
    required this.isLoading,
    required this.onToggleObscurePassword,
    required this.onToggleObscureConfirmPassword,
    required this.onCategoryChanged,
    required this.onTermsChanged,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Partner Registration',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 4),
          const Text(
            'Create your partner profile to start referring and onboarding societies',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),

          // Full Name
          TextFormField(
            controller: nameController,
            decoration: InputDecoration(
              labelText: 'Full Name *',
              hintText: 'e.g. Rajesh Sharma',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
            ),
            validator: (val) => val == null || val.trim().isEmpty ? 'Please enter your full name' : null,
          ),
          const SizedBox(height: 14),

          // 10-Digit Mobile Number
          TextFormField(
            controller: phoneController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              labelText: '10-Digit Mobile Number *',
              hintText: 'e.g. 9845011223',
              prefixText: '+91 ',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
            ),
            validator: (val) {
              final clean = val?.trim().replaceAll(RegExp(r'[^0-9]'), '') ?? '';
              if (clean.length < 10) return 'Enter a valid 10-digit mobile number';
              return null;
            },
          ),
          const SizedBox(height: 14),

          // Password
          TextFormField(
            controller: passwordController,
            obscureText: obscurePassword,
            decoration: InputDecoration(
              labelText: 'Password *',
              hintText: 'Minimum 6 characters',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.lock_rounded, color: AppColors.primary),
              suffixIcon: IconButton(
                icon: Icon(
                  obscurePassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                  color: Colors.grey.shade600,
                ),
                onPressed: onToggleObscurePassword,
              ),
            ),
            validator: (val) => val == null || val.trim().length < 6 ? 'Password must be at least 6 characters' : null,
          ),
          const SizedBox(height: 14),

          // Confirm Password
          TextFormField(
            controller: confirmPasswordController,
            obscureText: obscureConfirmPassword,
            decoration: InputDecoration(
              labelText: 'Confirm Password *',
              hintText: 'Re-enter your password',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.primary),
              suffixIcon: IconButton(
                icon: Icon(
                  obscureConfirmPassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                  color: Colors.grey.shade600,
                ),
                onPressed: onToggleObscureConfirmPassword,
              ),
            ),
            validator: (val) {
              if (val == null || val.trim().isEmpty) return 'Please confirm your password';
              if (val.trim() != passwordController.text.trim()) return 'Passwords do not match';
              return null;
            },
          ),
          const SizedBox(height: 14),

          // Email Address
          TextFormField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: InputDecoration(
              labelText: 'Email Address *',
              hintText: 'e.g. rajesh@realtybrokers.in',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.email_rounded, color: AppColors.primary),
            ),
            validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email address' : null,
          ),
          const SizedBox(height: 14),

          // Partner Category
          DropdownButtonFormField<String>(
            initialValue: selectedCategory,
            decoration: InputDecoration(
              labelText: 'Partner Category *',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.work_rounded, color: AppColors.primary),
            ),
            items: categories.map((cat) => DropdownMenuItem(value: cat, child: Text(cat))).toList(),
            onChanged: (val) {
              if (val != null) onCategoryChanged(val);
            },
          ),
          const SizedBox(height: 14),

          // Payout UPI ID
          TextFormField(
            controller: upiController,
            decoration: InputDecoration(
              labelText: 'Payout UPI ID (e.g. name@okhdfcbank)',
              hintText: 'For direct Cashfree bank transfers',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondary),
            ),
          ),
          const SizedBox(height: 14),

          // Operating City
          TextFormField(
            controller: cityController,
            decoration: InputDecoration(
              labelText: 'Operating City / Region *',
              hintText: 'e.g. Hyderabad / Pune / Bengaluru',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              prefixIcon: const Icon(Icons.location_city_rounded, color: AppColors.primary),
            ),
            validator: (val) => val == null || val.trim().isEmpty ? 'Enter your operating city' : null,
          ),
          const SizedBox(height: 14),

          // Consent Checkbox
          CheckboxListTile(
            contentPadding: EdgeInsets.zero,
            value: acceptedTerms,
            onChanged: (val) => onTermsChanged(val ?? true),
            controlAffinity: ListTileControlAffinity.leading,
            title: const Text(
              'I agree to GateLink Partner Terms & Code of Conduct for automated Cashfree disbursals.',
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 16),

          // Register Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: isLoading ? null : onSubmit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              ),
              child: isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text(
                      'Complete Registration & Start Earning',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
