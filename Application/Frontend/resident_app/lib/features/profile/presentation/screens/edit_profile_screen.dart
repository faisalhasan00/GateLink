import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../widgets/edit_profile_photo_header.dart';
import '../widgets/edit_profile_form.dart';
import '../widgets/edit_profile_residency_section.dart';

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
  bool _isUploadingPhoto = false;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider).value;
    final user = ref.read(currentUserProvider);
    _nameController = TextEditingController(
        text: profile?.name.isNotEmpty == true
            ? profile!.name
            : (user?.displayName ?? ''));
    _emailController = TextEditingController(
        text: profile?.email.isNotEmpty == true
            ? profile!.email
            : (user?.email ?? ''));
    _dobController = TextEditingController(text: profile?.dob ?? '');
    _selectedGender = (profile?.gender.isNotEmpty == true)
        ? profile!.gender
        : 'Male';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  Future<void> _pickDob() async {
    DateTime initial = DateTime.now().subtract(const Duration(days: 365 * 25));
    if (_dobController.text.isNotEmpty) {
      try {
        final parts = _dobController.text.split(RegExp(r'[\s/-]+'));
        if (parts.length >= 3) {
          final day = int.tryParse(parts[0]) ?? 1;
          final month = _parseMonth(parts[1]);
          final year = int.tryParse(parts[2]) ?? 1995;
          initial = DateTime(year, month, day);
        }
      } catch (_) {}
    }

    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      final formatted =
          '${picked.day.toString().padLeft(2, '0')} ${months[picked.month - 1]} ${picked.year}';
      setState(() {
        _dobController.text = formatted;
      });
    }
  }

  int _parseMonth(String m) {
    const months = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    final idx = months.indexOf(m.toLowerCase());
    return idx != -1 ? idx + 1 : (int.tryParse(m) ?? 1);
  }

  Future<void> _captureAndUpload(ImageSource source) async {
    final user = ref.read(currentUserProvider);
    final profile = ref.read(userProfileProvider).value;
    final societyId = profile?.societyId ?? '';

    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No authenticated session found.')),
      );
      return;
    }

    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(
        source: source,
        imageQuality: 70,
        maxWidth: 600,
        maxHeight: 600,
      );

      if (pickedFile == null) return;

      setState(() => _isUploadingPhoto = true);

      final photoUrl = await ref
          .read(profileControllerProvider.notifier)
          .uploadProfilePhoto(
            uid: user.uid,
            societyId: societyId,
            imageFile: File(pickedFile.path),
          );

      if (mounted) {
        if (photoUrl != null) {
          ref.invalidate(userProfileProvider);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile photo updated successfully!'),
              backgroundColor: AppColors.success,
            ),
          );
        } else {
          final err = ref.read(profileControllerProvider).errorMessage ??
              'Failed to upload photo.';
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(err), backgroundColor: AppColors.error),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Upload error: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploadingPhoto = false);
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    final user = ref.read(currentUserProvider);
    final profile = ref.read(userProfileProvider).value;
    final societyId = profile?.societyId ?? '';

    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No authenticated user session found.')),
      );
      return;
    }

    final success =
        await ref.read(profileControllerProvider.notifier).updateProfile(
              uid: user.uid,
              societyId: societyId,
              name: _nameController.text.trim(),
              email: _emailController.text.trim(),
              gender: _selectedGender,
              dob: _dobController.text.trim(),
            );

    if (mounted) {
      if (success) {
        ref.invalidate(userProfileProvider);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: AppColors.success,
          ),
        );
        context.pop();
      } else {
        final errorMsg = ref.read(profileControllerProvider).errorMessage ??
            'Update failed.';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMsg),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(userProfileProvider).value;
    final user = ref.watch(currentUserProvider);
    final phone = profile?.phone.isNotEmpty == true
        ? profile!.phone
        : (user?.phoneNumber?.isNotEmpty == true
            ? user!.phoneNumber!
            : 'Not added');
    final societyName = profile?.displaySocietyName ?? 'Housing Society';
    final societyCode = profile?.societyCode ?? '';
    final flatNumber = profile?.displayFlatNumber ?? 'Not assigned';
    final tower = profile?.tower ?? '';
    final roleTitle = profile?.displayRoleTitle ?? 'Resident';
    final controllerState = ref.watch(profileControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Edit Profile'),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Modular Profile Photo Header
              EditProfilePhotoHeader(
                displayName: _nameController.text.isNotEmpty
                    ? _nameController.text
                    : (profile?.name ?? 'Resident'),
                photoUrl: profile?.photoUrl,
                isUploading: _isUploadingPhoto,
                onPickImage: _captureAndUpload,
              ),
              const SizedBox(height: AppSpacing.md),

              // Modular Form Fields (Name, Email, Gender, DOB)
              EditProfileForm(
                nameController: _nameController,
                emailController: _emailController,
                dobController: _dobController,
                selectedGender: _selectedGender,
                onGenderChanged: (g) => setState(() => _selectedGender = g),
                onPickDob: _pickDob,
              ),
              const SizedBox(height: AppSpacing.lg),

              // Modular Verified Residency Details Section
              EditProfileResidencySection(
                phone: phone,
                societyName: societyName,
                societyCode: societyCode,
                tower: tower,
                flatNumber: flatNumber,
                roleTitle: roleTitle,
              ),
              const SizedBox(height: AppSpacing.xl),

              // Reusable AppButton
              AppButton(
                text: 'Save Profile Changes',
                onPressed: _handleSave,
                isLoading: controllerState.isLoading,
                size: AppButtonSize.lg,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
