import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/widgets.dart';

class EditProfilePhotoHeader extends StatelessWidget {
  final String displayName;
  final String? photoUrl;
  final bool isUploading;
  final Function(ImageSource source) onPickImage;

  const EditProfilePhotoHeader({
    super.key,
    required this.displayName,
    required this.photoUrl,
    required this.isUploading,
    required this.onPickImage,
  });

  void _showPickerSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Change Profile Photo',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: AppColors.primarySurface,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt_rounded,
                      color: AppColors.primary, size: 22),
                ),
                title: const Text('Take Photo',
                    style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Use camera to capture new photo'),
                onTap: () {
                  Navigator.pop(ctx);
                  onPickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: AppColors.primarySurface,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.photo_library_rounded,
                      color: AppColors.primary, size: 22),
                ),
                title: const Text('Choose from Gallery',
                    style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Select existing photo from device'),
                onTap: () {
                  Navigator.pop(ctx);
                  onPickImage(ImageSource.gallery);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Center(
          child: Stack(
            alignment: Alignment.center,
            children: [
              AppAvatar(
                name: displayName.isNotEmpty ? displayName : 'Resident',
                imageUrl: photoUrl,
                size: AppAvatarSize.xxl,
                isEditable: !isUploading,
                onEditTap: () => _showPickerSheet(context),
              ),
              if (isUploading)
                Container(
                  width: AppAvatarSize.xxl.diameter,
                  height: AppAvatarSize.xxl.diameter,
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.5),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 3,
                    ),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Center(
          child: TextButton.icon(
            onPressed: isUploading ? null : () => _showPickerSheet(context),
            icon: const Icon(Icons.camera_alt_outlined, size: 16),
            label: Text(
              isUploading ? 'Uploading photo...' : 'Change Profile Photo',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
        ),
      ],
    );
  }
}
