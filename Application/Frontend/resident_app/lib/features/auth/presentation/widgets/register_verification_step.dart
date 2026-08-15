import 'dart:io';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import 'resident_type_selector.dart';
import 'residency_occupancy_selector.dart';
import 'residency_document_uploader.dart';

class RegisterVerificationStep extends StatelessWidget {
  final String selectedYouAre;
  final String selectedOccupancy;
  final String documentType;
  final File? documentFile;
  final bool isLoading;
  final ValueChanged<String> onYouAreChanged;
  final ValueChanged<String> onOccupancyChanged;
  final void Function(File file, String docType) onDocumentPicked;
  final VoidCallback onSubmit;

  const RegisterVerificationStep({
    super.key,
    required this.selectedYouAre,
    required this.selectedOccupancy,
    required this.documentType,
    required this.documentFile,
    required this.isLoading,
    required this.onYouAreChanged,
    required this.onOccupancyChanged,
    required this.onDocumentPicked,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Residency & Verification',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Help the Society Admin verify and activate your residency',
          style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
        ),
        const SizedBox(height: AppSpacing.xl),

        // 1. Modular Resident Type Radio Group
        ResidentTypeSelector(
          selectedYouAre: selectedYouAre,
          onYouAreChanged: onYouAreChanged,
        ),
        const SizedBox(height: AppSpacing.md),

        // 2. Modular Occupancy Status Radio Group
        ResidencyOccupancySelector(
          selectedOccupancy: selectedOccupancy,
          onOccupancyChanged: onOccupancyChanged,
        ),
        const SizedBox(height: AppSpacing.md),

        // 3. Modular Proof Document Uploader
        ResidencyDocumentUploader(
          documentType: documentType,
          documentFile: documentFile,
          onDocumentPicked: onDocumentPicked,
        ),
        const SizedBox(height: AppSpacing.xxl),

        // Submit Button
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: isLoading ? null : onSubmit,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
            ),
            child: isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Text(
                    'Complete Registration ➔',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
          ),
        ),
      ],
    );
  }
}
