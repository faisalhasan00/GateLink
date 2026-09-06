import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/facility_models.dart';

class DocumentsScreen extends ConsumerWidget {
  const DocumentsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final documentsAsync = ref.watch(documentsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Society Documents & Bylaws'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.upload_file),
        label: const Text('Add Document'),
        onPressed: () {
          if (society != null) _showAddDocumentModal(context, ref, society.id);
        },
      ),
      body: documentsAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading society documents...'),
        error: (err, _) => ErrorStateWidget(message: err.toString()),
        data: (docs) {
          if (docs.isEmpty) {
            return EmptyStateWidget(
              title: 'No Documents Uploaded',
              description: 'Upload official society bylaws, AGM minutes, and financial audit files.',
              icon: Icons.folder_open_outlined,
              actionLabel: 'Upload Document Record',
              onAction: () {
                if (society != null) _showAddDocumentModal(context, ref, society.id);
              },
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final doc = docs[index];
              return AppCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.crimsonLight,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.picture_as_pdf, color: AppColors.dangerCrimson, size: 26),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            doc.title,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              AppBadge(label: doc.category.toUpperCase(), variant: BadgeVariant.neutral, fontSize: 10),
                              const SizedBox(width: 8),
                              Text('By ${doc.uploadedBy}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    if (doc.fileUrl.isNotEmpty)
                      IconButton(
                        icon: const Icon(Icons.open_in_new, color: AppColors.secondarySky, size: 22),
                        onPressed: () async {
                          final uri = Uri.tryParse(doc.fileUrl);
                          if (uri != null && await canLaunchUrl(uri)) {
                            await launchUrl(uri, mode: LaunchMode.externalApplication);
                          }
                        },
                      ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showAddDocumentModal(BuildContext context, WidgetRef ref, String societyId) {
    final titleCtrl = TextEditingController();
    final urlCtrl = TextEditingController();
    String selectedCategory = 'Bylaws';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(modalCtx).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Upload Society Document Record', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 16),
                  AppTextField(controller: titleCtrl, label: 'Document Title', hintText: 'e.g. Society Bylaws 2026 / AGM Minutes Q2'),
                  const SizedBox(height: 12),
                  const Text('Document Category', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: selectedCategory,
                    decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
                    items: const [
                      DropdownMenuItem(value: 'Bylaws', child: Text('Society Bylaws & Rules')),
                      DropdownMenuItem(value: 'AGM Minutes', child: Text('AGM Minutes & Circulars')),
                      DropdownMenuItem(value: 'Financials', child: Text('Financial Audits & Statements')),
                      DropdownMenuItem(value: 'Vendor Contracts', child: Text('Vendor AMC & Contracts')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedCategory = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  AppTextField(controller: urlCtrl, label: 'Document File Link (PDF/Cloud URL)', hintText: 'https://storage...'),
                  const SizedBox(height: 20),
                  AppButton(
                    label: 'Publish Document',
                    width: double.infinity,
                    onPressed: () async {
                      if (titleCtrl.text.trim().isEmpty) return;
                      final document = DocumentRecordModel(
                        id: '',
                        title: titleCtrl.text.trim(),
                        category: selectedCategory,
                        fileUrl: urlCtrl.text.trim(),
                      );
                      await ref.read(firestoreServiceProvider).uploadDocumentRecord(societyId, document);
                      if (modalCtx.mounted) Navigator.of(modalCtx).pop();
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
