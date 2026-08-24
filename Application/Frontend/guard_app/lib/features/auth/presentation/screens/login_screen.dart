import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _isRegisterMode = false;
  bool _agreedToPrivacyPolicy = false;
  String? _consentError;

  // Register fields
  final _nameController = TextEditingController();
  final _flatController = TextEditingController();
  final _societyCodeController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    _flatController.dispose();
    _societyCodeController.dispose();
    super.dispose();
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppColors.error),
    );
  }

  Future<void> _handleEmailLogin() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await ref.read(authServiceProvider).signInWithEmail(
        _emailController.text,
        _passwordController.text,
      );
      if (mounted) context.go('/home');
    } on FirebaseAuthException catch (e) {
      _showError(e.message ?? 'Login failed. Please try again.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await ref.read(authServiceProvider).registerWithEmail(
        email: _emailController.text,
        password: _passwordController.text,
        name: _nameController.text,
        flatNumber: _flatController.text,
        societyCode: _societyCodeController.text,
        role: 'resident',
      );
      if (mounted) context.go('/pending-approval');
    } on FirebaseAuthException catch (e) {
      _showError(e.message ?? 'Registration failed. Please try again.');
    } catch (e) {
      _showError(e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.xl),
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.primarySurface,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: const Icon(Icons.apartment_rounded, color: AppColors.primary, size: 30),
                ),
                const SizedBox(height: AppSpacing.xl),
                Text(
                  _isRegisterMode ? 'Create Account' : 'Welcome Back',
                  style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  _isRegisterMode ? 'Register your account to get started' : 'Sign in to your GateLink Guard account',
                  style: const TextStyle(fontSize: 15, color: AppColors.textSecondary),
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Register-only fields
                if (_isRegisterMode) ...[
                  _buildField('Full Name', _nameController, hint: 'e.g. Arjun Kumar'),
                  const SizedBox(height: AppSpacing.md),
                  _buildField('Flat Number', _flatController, hint: 'e.g. A-101'),
                  const SizedBox(height: AppSpacing.md),
                  _buildField('Society Access Code', _societyCodeController, hint: 'e.g. GW-8492'),
                  const SizedBox(height: AppSpacing.md),
                ],

                _buildField('Email Address', _emailController, hint: 'you@example.com', keyboardType: TextInputType.emailAddress),
                const SizedBox(height: AppSpacing.md),
                _buildPasswordField(),
                const SizedBox(height: AppSpacing.md),

                // DPDP Privacy Consent Checkbox (Initially Unchecked false)
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
                                ..onTap = () async {
                                  final Uri uri = Uri.parse('https://gatelink.in/privacy');
                                  try { await launchUrl(uri, mode: LaunchMode.externalApplication); } catch (_) {}
                                },
                            ),
                            const TextSpan(text: ' and '),
                            TextSpan(
                              text: 'Terms of Service',
                              style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () async {
                                  final Uri uri = Uri.parse('https://gatelink.in/terms');
                                  try { await launchUrl(uri, mode: LaunchMode.externalApplication); } catch (_) {}
                                },
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
                const SizedBox(height: AppSpacing.xl),

                // Main Action Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: _isLoading
                        ? null
                        : () {
                            if (!_agreedToPrivacyPolicy) {
                              setState(() {
                                _consentError = 'You must agree to the Privacy Policy and Terms of Service to proceed.';
                              });
                              return;
                            }
                            if (_isRegisterMode) {
                              _handleRegister();
                            } else {
                              _handleEmailLogin();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                    ),
                    child: _isLoading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text(_isRegisterMode ? 'Create Account' : 'Sign In', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                  ),
                ),

                const SizedBox(height: AppSpacing.xl),
                Center(
                  child: TextButton(
                    onPressed: () => context.push('/register'),
                    child: const Text(
                      'New resident? Register & Add Home',
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 15),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, {String? hint, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(hintText: hint),
          validator: (v) => (v == null || v.isEmpty) ? '$label is required' : null,
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Password', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
        const SizedBox(height: 8),
        TextFormField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          decoration: InputDecoration(
            hintText: 'Enter your password',
            suffixIcon: IconButton(
              icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
            ),
          ),
          validator: (v) {
            if (v == null || v.isEmpty) return 'Password is required';
            if (v.length < 6) return 'Password must be at least 6 characters';
            return null;
          },
        ),
      ],
    );
  }
}
