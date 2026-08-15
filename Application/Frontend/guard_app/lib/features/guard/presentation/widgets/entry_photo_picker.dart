import 'dart:io';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class EntryPhotoPicker extends StatelessWidget {
  final File? photoFile;
  final VoidCallback onPickPhoto;

  const EntryPhotoPicker({
    super.key,
    required this.photoFile,
    required this.onPickPhoto,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTap: onPickPhoto,
          child: Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.border),
              image: photoFile != null
                  ? DecorationImage(
                      image: FileImage(photoFile!),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: photoFile == null
                ? const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.camera_alt_rounded,
                          color: AppColors.textSecondary, size: 24),
                      SizedBox(height: 2),
                      Text('Photo',
                          style: TextStyle(
                              fontSize: 10, color: AppColors.textSecondary)),
                    ],
                  )
                : null,
          ),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Visitor Photo (Optional)',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 4),
              Text(
                photoFile == null
                    ? 'Tap camera icon to capture visitor photo'
                    : 'Photo captured successfully!',
                style: TextStyle(
                  fontSize: 12,
                  color: photoFile == null
                      ? AppColors.textDisabled
                      : AppColors.success,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
