import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _dobController;
  String _selectedGender = 'Male';
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider).value;
    _nameController = TextEditingController(text: profile?['name'] ?? '');
    _emailController = TextEditingController(text: profile?['email'] ?? '');
    _dobController = TextEditingController(text: profile?['dob'] ?? '12 Oct 1992');
    _selectedGender = profile?['gender'] ?? 'Male';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _saving = true);
    try {
      final user = FirebaseAuth.instance.currentUser;
      final profile = ref.read(userProfileProvider).value;
      final societyId = profile?['societyId'] ?? 'SOC-001';

      if (user != null) {
        await FirebaseFirestore.instance
            .collection('societies/$societyId/users')
            .doc(user.uid)
            .set({
          'name': _nameController.text.trim(),
          'email': _emailController.text.trim(),
          'gender': _selectedGender,
          'dob': _dobController.text.trim(),
          'updatedAt': DateTime.now().toIso8601String(),
        }, SetOptions(merge: true));

        // Add Activity Log
        await FirebaseFirestore.instance
            .collection('societies/$societyId/users/${user.uid}/activity_logs')
            .add({
          'action': 'Profile Updated',
          'description': 'Updated name, email, gender, and date of birth details.',
          'timestamp': DateTime.now().toIso8601String(),
        });
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: AppColors.success,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error updating profile: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(userProfileProvider).value;
    final phone = profile?['phone'] ?? 'No Phone';
    final societyName = profile?['societyName'] ?? 'Greenwood Heights';
    final flatNumber = profile?['flatNumber'] ?? 'A-402';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Edit Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Read-Only Banner Notice
              Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.primarySurface,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline_rounded, color: AppColors.primary, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Mobile number, society, and flat assignment are read-only and verified by society administration.',
                        style: TextStyle(fontSize: 12, color: AppColors.primary, height: 1.3),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Full Name
              const Text('Full Name *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  hintText: 'Enter full name',
                  prefixIcon: const Icon(Icons.person_outline_rounded),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                validator: (v) => v == null || v.trim().isEmpty ? 'Full name is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              // Email Address
              const Text('Email Address *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  hintText: 'Enter email address',
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
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
                        const Text('Gender', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<String>(
                          value: _selectedGender,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                          ),
                          items: ['Male', 'Female', 'Other']
                              .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                              .toList(),
                          onChanged: (v) => setState(() => _selectedGender = v ?? 'Male'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Date of Birth', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _dobController,
                          decoration: InputDecoration(
                            hintText: 'DD MMM YYYY',
                            prefixIcon: const Icon(Icons.calendar_today_rounded, size: 18),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              const Divider(),
              const SizedBox(height: AppSpacing.md),

              // Read Only Details Section
              const Text('READ-ONLY SYSTEM DETAILS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.textSecondary)),
              const SizedBox(height: AppSpacing.md),

              _ReadOnlyField(label: 'Registered Mobile Number', value: phone, icon: Icons.phone_android_rounded),
              const SizedBox(height: AppSpacing.sm),
              _ReadOnlyField(label: 'Assigned Society', value: societyName, icon: Icons.location_city_rounded),
              const SizedBox(height: AppSpacing.sm),
              _ReadOnlyField(label: 'Assigned Flat', value: 'Flat $flatNumber', icon: Icons.home_work_rounded),

              const SizedBox(height: AppSpacing.xl),

              // Save Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _saving ? null : _handleSave,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                  ),
                  child: _saving
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                      : const Text('Save Profile Changes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ReadOnlyField extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _ReadOnlyField({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.border.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
            ],
          ),
          const Spacer(),
          const Icon(Icons.lock_rounded, size: 16, color: AppColors.textSecondary),
        ],
      ),
    );
  }
}
