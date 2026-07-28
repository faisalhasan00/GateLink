import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';

class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  ConsumerState<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscureCurrent = true;
  bool _obscureNew = true;
  bool _obscureConfirm = true;
  bool _submitting = false;

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // Password Policy Enforcer: Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  bool _validatePasswordPolicy(String pwd) {
    if (pwd.length < 8) return false;
    if (!pwd.contains(RegExp(r'[A-Z]'))) return false;
    if (!pwd.contains(RegExp(r'[a-z]'))) return false;
    if (!pwd.contains(RegExp(r'[0-9]'))) return false;
    if (!pwd.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) return false;
    return true;
  }

  Future<void> _handleChangePassword() async {
    if (!_formKey.currentState!.validate()) return;

    final user = FirebaseAuth.instance.currentUser;
    if (user == null || user.email == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No authenticated user session found.')),
      );
      return;
    }

    setState(() => _submitting = true);

    try {
      // 1. Re-authenticate user with current password
      final cred = EmailAuthProvider.credential(
        email: user.email!,
        password: _currentPasswordController.text,
      );
      await user.reauthenticateWithCredential(cred);

      // 2. Update to new password
      await user.updatePassword(_newPasswordController.text);

      // 3. Log Activity to Firestore
      final profile = ref.read(userProfileProvider).value;
      final societyId = profile?['societyId'] ?? 'SOC-001';

      await FirebaseFirestore.instance
          .collection('societies/$societyId/users/${user.uid}/activity_logs')
          .add({
        'action': 'Password Changed',
        'description': 'Account security password updated successfully.',
        'timestamp': DateTime.now().toIso8601String(),
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Password changed successfully!'),
            backgroundColor: AppColors.success,
          ),
        );
        context.pop();
      }
    } on FirebaseAuthException catch (e) {
      String msg = 'Failed to change password.';
      if (e.code == 'wrong-password' || e.code == 'invalid-credential') {
        msg = 'Current password is incorrect.';
      } else if (e.code == 'weak-password') {
        msg = 'The new password is too weak.';
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(msg), backgroundColor: AppColors.error),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Change Password')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Security Rules Info Banner
              Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.secondary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.secondary.withValues(alpha: 0.3)),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.shield_outlined, color: AppColors.secondary, size: 20),
                        SizedBox(width: 8),
                        Text('Password Security Criteria', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.secondary)),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text('• Minimum 8 characters long\n• Must include 1 Uppercase & 1 Lowercase letter\n• Must include 1 Number & 1 Special symbol (!@#\$%)', style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Current Password
              const Text('Current Password *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _currentPasswordController,
                obscureText: _obscureCurrent,
                decoration: InputDecoration(
                  hintText: 'Enter current password',
                  prefixIcon: const Icon(Icons.lock_outline_rounded),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureCurrent ? Icons.visibility_off_outlined : Icons.visibility_outlined),
                    onPressed: () => setState(() => _obscureCurrent = !_obscureCurrent),
                  ),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Current password is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              // New Password
              const Text('New Password *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _newPasswordController,
                obscureText: _obscureNew,
                decoration: InputDecoration(
                  hintText: 'Enter new password',
                  prefixIcon: const Icon(Icons.lock_reset_rounded),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureNew ? Icons.visibility_off_outlined : Icons.visibility_outlined),
                    onPressed: () => setState(() => _obscureNew = !_obscureNew),
                  ),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'New password is required';
                  if (v == _currentPasswordController.text) return 'New password cannot be identical to current password';
                  if (!_validatePasswordPolicy(v)) return 'Password does not meet security criteria';
                  return null;
                },
              ),
              const SizedBox(height: AppSpacing.md),

              // Confirm New Password
              const Text('Confirm New Password *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: _obscureConfirm,
                decoration: InputDecoration(
                  hintText: 'Re-enter new password',
                  prefixIcon: const Icon(Icons.check_circle_outline_rounded),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined),
                    onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please confirm your new password';
                  if (v != _newPasswordController.text) return 'Passwords do not match';
                  return null;
                },
              ),

              const SizedBox(height: AppSpacing.xl),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _handleChangePassword,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                  ),
                  child: _submitting
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                      : const Text('Update Account Password', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
