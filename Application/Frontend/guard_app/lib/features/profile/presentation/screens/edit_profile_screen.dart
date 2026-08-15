import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/profile_providers.dart';
import '../widgets/guard_profile_form.dart';
import '../widgets/guard_residency_info.dart';

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
    _dobController =
        TextEditingController(text: profile?['dob'] ?? '12 Oct 1992');
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
      final societyId = profile?['societyId'] as String?;

      if (societyId == null || societyId.isEmpty) {
        throw Exception('Society ID is missing from user profile');
      }

      if (user != null) {
        final userRepo = ref.read(userRepositoryProvider);
        await userRepo.updateUserProfile(societyId, user.uid, {
          'name': _nameController.text.trim(),
          'email': _emailController.text.trim(),
          'gender': _selectedGender,
          'dob': _dobController.text.trim(),
          'updatedAt': DateTime.now().toIso8601String(),
        });

        await userRepo.logAuditAction(societyId, {
          'action': 'Profile Updated',
          'description':
              'Updated name, email, gender, and date of birth details.',
          'timestamp': DateTime.now().toIso8601String(),
        });

        ref.invalidate(userProfileProvider);
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
    final societyName = profile?['societyName'] ?? 'Housing Society';
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
              // Modular Form Fields (Name, Email, Gender, DOB)
              GuardProfileForm(
                nameController: _nameController,
                emailController: _emailController,
                dobController: _dobController,
                selectedGender: _selectedGender,
                onGenderChanged: (g) => setState(() => _selectedGender = g),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Modular Read-Only Residency Info
              GuardResidencyInfo(
                phone: phone,
                societyName: societyName,
                flatNumber: flatNumber,
              ),
              const SizedBox(height: AppSpacing.xl),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _saving ? null : _handleSave,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                    ),
                  ),
                  child: _saving
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : const Text(
                          'Save Profile Changes',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
