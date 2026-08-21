import 'dart:io';
import 'package:flutter/material.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ResidencyProofStep extends StatelessWidget {
  final SocietyModel? selectedSocietyModel;
  final String selectedBuilding;
  final String selectedFlatNo;
  final String selectedCity;
  final String selectedCountry;
  final String selectedYouAre;
  final String selectedOccupancy;
  final File? documentFile;
  final bool isLoading;
  final ValueChanged<String> onYouAreChanged;
  final ValueChanged<String> onOccupancyChanged;
  final VoidCallback onPickDocument;
  final VoidCallback onSubmit;

  const ResidencyProofStep({
    super.key,
    required this.selectedSocietyModel,
    required this.selectedBuilding,
    required this.selectedFlatNo,
    required this.selectedCity,
    required this.selectedCountry,
    required this.selectedYouAre,
    required this.selectedOccupancy,
    required this.documentFile,
    required this.isLoading,
    required this.onYouAreChanged,
    required this.onOccupancyChanged,
    required this.onPickDocument,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Residency & Verification', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        const Text('Specify occupancy status and upload document proof for RWA review', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
        const SizedBox(height: AppSpacing.xl),

        // Selected Flat Summary Box
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              const Icon(Icons.home_work_rounded, color: AppColors.primary, size: 36),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${selectedSocietyModel?.name ?? "Housing Society"} ($selectedBuilding-$selectedFlatNo)', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.textPrimary)),
                    Text('Code: ${selectedSocietyModel?.code ?? "SOC-001"} | $selectedCity, $selectedCountry', style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // You Are (Ownership & Family Status)
        const Text('You are', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.gray300),
          ),
          child: Column(
            children: [
              _buildRadioOption('Flat Owner', selectedYouAre, onYouAreChanged),
              const Divider(height: 1),
              _buildRadioOption('Renting with family', selectedYouAre, onYouAreChanged),
              const Divider(height: 1),
              _buildRadioOption('Renting with other flatmates', selectedYouAre, onYouAreChanged),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Occupancy Status
        const Text('Occupancy Status', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.gray300),
          ),
          child: Column(
            children: [
              _buildRadioOption('Currently residing', selectedOccupancy, onOccupancyChanged),
              const Divider(height: 1),
              _buildRadioOption('Flat is let out', selectedOccupancy, onOccupancyChanged),
              const Divider(height: 1),
              _buildRadioOption('Flat is empty', selectedOccupancy, onOccupancyChanged),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Document Upload Box
        const Text('Upload Document Proof for RWA Review', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        GestureDetector(
          onTap: onPickDocument,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: documentFile != null ? AppColors.success : AppColors.gray300, width: 1.5),
            ),
            child: Row(
              children: [
                Icon(
                  documentFile != null ? Icons.check_circle_rounded : Icons.cloud_upload_outlined,
                  color: documentFile != null ? AppColors.success : AppColors.primary,
                  size: 32,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        documentFile != null ? 'Document Selected' : 'Upload Proof (Rent Agreement / Utility Bill)',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: documentFile != null ? AppColors.success : AppColors.textPrimary),
                      ),
                      Text(
                        documentFile != null ? documentFile!.path.split('/').last : 'Tap to attach address proof for RWA Admin review',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.add_photo_alternate_outlined, color: AppColors.primary),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.xxl),

        // Final Submit Button
        SizedBox(
          width: double.infinity,
          height: 54,
          child: ElevatedButton(
            onPressed: isLoading ? null : onSubmit,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
            ),
            child: isLoading
                ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                : const Text('Add Flat/Villa & Submit ➔', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
          ),
        ),
      ],
    );
  }

  Widget _buildRadioOption(String value, String groupValue, ValueChanged<String> onChanged) {
    final isSelected = value == groupValue;
    return InkWell(
      onTap: () => onChanged(value),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
              color: isSelected ? AppColors.primary : AppColors.gray400,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(value, style: TextStyle(fontSize: 15, fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400, color: AppColors.textPrimary)),
            ),
          ],
        ),
      ),
    );
  }
}
