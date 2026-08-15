import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ResidencyDocumentUploader extends StatelessWidget {
  final String documentType;
  final File? documentFile;
  final void Function(File file, String docType) onDocumentPicked;

  const ResidencyDocumentUploader({
    super.key,
    required this.documentType,
    required this.documentFile,
    required this.onDocumentPicked,
  });

  void _showDocumentPickerModal(BuildContext context) {
    final picker = ImagePicker();

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Upload Verification Document',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            const Text(
              'Select document format (Image, PDF, or Document)',
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(
                Icons.photo_library_rounded,
                color: AppColors.primary,
                size: 28,
              ),
              title: const Text(
                'Image / Photo',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: const Text('PNG, JPG, WEBP from Gallery'),
              onTap: () async {
                Navigator.pop(ctx);
                final picked = await picker.pickImage(
                  source: ImageSource.gallery,
                  maxWidth: 800,
                  maxHeight: 800,
                  imageQuality: 60,
                );
                if (picked != null) {
                  onDocumentPicked(
                    File(picked.path),
                    'Rent Agreement / Image',
                  );
                }
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(
                Icons.picture_as_pdf_rounded,
                color: Colors.redAccent,
                size: 28,
              ),
              title: const Text(
                'PDF / Document File',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: const Text('PDF, DOC, DOCX, or scanned document'),
              onTap: () async {
                Navigator.pop(ctx);
                final result = await FilePicker.platform.pickFiles(
                  type: FileType.custom,
                  allowedExtensions: [
                    'pdf',
                    'doc',
                    'docx',
                    'png',
                    'jpg',
                    'jpeg'
                  ],
                );
                if (result != null && result.files.single.path != null) {
                  final ext =
                      result.files.single.extension?.toUpperCase() ?? 'PDF';
                  onDocumentPicked(
                    File(result.files.single.path!),
                    '$ext Document',
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 6),
          child: Text(
            'RESIDENCY PROOF DOCUMENT (OPTIONAL)',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        InkWell(
          onTap: () => _showDocumentPickerModal(context),
          borderRadius: BorderRadius.circular(AppRadius.md),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(
                color: documentFile != null
                    ? AppColors.primary
                    : AppColors.gray300,
                style: BorderStyle.solid,
              ),
            ),
            child: documentFile != null
                ? Row(
                    children: [
                      const Icon(Icons.check_circle_rounded,
                          color: AppColors.success, size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              documentType,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              documentFile!.path
                                  .split(Platform.pathSeparator)
                                  .last,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () => _showDocumentPickerModal(context),
                        child: const Text('Change'),
                      ),
                    ],
                  )
                : const Column(
                    children: [
                      Icon(Icons.cloud_upload_outlined,
                          size: 36, color: AppColors.primary),
                      SizedBox(height: 8),
                      Text(
                        'Upload Rent Agreement / Electricity Bill',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Supported formats: PDF, PNG, JPG',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ],
    );
  }
}
