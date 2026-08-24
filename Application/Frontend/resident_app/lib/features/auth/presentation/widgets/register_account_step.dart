import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class RegisterAccountStep extends StatefulWidget {
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
  State<RegisterAccountStep> createState() => _RegisterAccountStepState();
}

class _RegisterAccountStepState extends State<RegisterAccountStep> {
  bool _agreedToPrivacyPolicy = false;
  String? _consentError;

  Future<void> _launchUrl(String urlStr) async {
    final Uri uri = Uri.parse(urlStr);
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: widget.formKey,
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
            controller: widget.nameController,
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
            controller: widget.emailController,
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
            controller: widget.phoneController,
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
            controller: widget.passwordController,
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
            controller: widget.confirmPasswordController,
            isPassword: true,
            hintText: '••••••••',
            prefixIcon: Icons.lock_outline_rounded,
            validator: (v) {
              if (v != widget.passwordController.text) {
                return 'Passwords do not match';
              }
              return null;
            },
          ),
          const SizedBox(height: AppSpacing.lg),

          // DPDP Consent Checkbox (Initially Unchecked false)
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 24,
                height: 24,
                child: Checkbox(
                  value: _agreedToPrivacyPolicy,
                  activeColor: AppColors.primary,
                  onChanged: (val) {
                    setState(() {
                      _agreedToPrivacyPolicy = val ?? false;
                      if (_agreedToPrivacyPolicy) _consentError = null;
                    });
                  },
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: RichText(
                  text: TextSpan(
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                    children: [
                      const TextSpan(text: 'I agree to the GateLink '),
                      TextSpan(
                        text: 'Privacy Policy',
                        style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                        recognizer: TapGestureRecognizer()
                          ..onTap = () => _launchUrl('https://gatelink.in/privacy'),
                      ),
                      const TextSpan(text: ' and '),
                      TextSpan(
                        text: 'Terms of Service',
                        style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                        recognizer: TapGestureRecognizer()
                          ..onTap = () => _launchUrl('https://gatelink.in/terms'),
                      ),
                      const TextSpan(text: ' under DPDP Act 2023.'),
                    ],
                  ),
                ),
              ),
            ],
          ),
          if (_consentError != null) ...[
            const SizedBox(height: 6),
            Text(
              _consentError!,
              style: const TextStyle(color: AppColors.error, fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ],
          const SizedBox(height: AppSpacing.xxl),

          // Reusable AppButton
          AppButton(
            text: 'Next: Select Location & Society ➔',
            size: AppButtonSize.lg,
            onPressed: () {
              if (!_agreedToPrivacyPolicy) {
                setState(() {
                  _consentError = 'You must agree to the Privacy Policy and Terms of Service to proceed.';
                });
                return;
              }
              if (widget.formKey.currentState!.validate()) {
                widget.onNext();
              }
            },
          ),
        ],
      ),
    );
  }
}

