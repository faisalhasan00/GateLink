import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import 'package:url_launcher/url_launcher.dart';

class DocumentScreen extends ConsumerStatefulWidget {
  const DocumentScreen({super.key});

  @override
  ConsumerState<DocumentScreen> createState() => _DocumentScreenState();
}

class _DocumentScreenState extends ConsumerState<DocumentScreen> {
  String _selectedCategory = 'All';

  static const Map<String, Color> _categoryColors = {
    'Rules': AppColors.primary,
    'Financial': AppColors.success,
    'Compliance': AppColors.warning,
    'Directory': AppColors.info,
  };

  static const Map<String, IconData> _categoryIcons = {
    'Rules': Icons.gavel_rounded,
    'Financial': Icons.bar_chart_rounded,
    'Compliance': Icons.verified_rounded,
    'Directory': Icons.contacts_rounded,
  };

  @override
  Widget build(BuildContext context) {
    final docsAsync = ref.watch(documentsStreamProvider);
    final categories = ['All', 'Rules', 'Financial', 'Compliance', 'Directory'];

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home/dashboard');
            }
          },
        ),
        title: const Text('Society Documents'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // Filter Row
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(AppSpacing.pagePadding, 0,
                AppSpacing.pagePadding, AppSpacing.md),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: categories.map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedCategory = cat),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 7),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.gray100,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        child: Text(
                          cat,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight:
                                isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected
                                ? Colors.white
                                : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Document List
          Expanded(
            child: docsAsync.when(
              data: (snapshot) {
                final allDocs = snapshot.docs;
                final filtered = _selectedCategory == 'All'
                    ? allDocs
                    : allDocs.where((doc) {
                        final data = doc.data() as Map<String, dynamic>;
                        return data['category'] == _selectedCategory;
                      }).toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.folder_off_rounded,
                            size: 48, color: AppColors.gray300),
                        const SizedBox(height: 12),
                        const Text('No documents found',
                            style: TextStyle(color: AppColors.textSecondary)),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final svc = ref.read(firestoreServiceProvider);
                            if (svc != null) {
                              await svc.seedDocumentsIfEmpty();
                            }
                          },
                          icon: const Icon(Icons.download_rounded),
                          label: const Text('Load Society Documents'),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final data = filtered[index].data() as Map<String, dynamic>;
                    final title = data['title'] ?? 'Document';
                    final category = data['category'] ?? 'Rules';
                    final size = data['size'] ?? '0 KB';
                    final date = data['date'] ?? '';
                    final downloadUrl = data['downloadUrl'] as String?;

                    final color =
                        _categoryColors[category] ?? AppColors.primary;
                    final icon = _categoryIcons[category] ??
                        Icons.insert_drive_file_rounded;

                    return Container(
                      margin: const EdgeInsets.only(bottom: AppSpacing.cardGap),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadius.card),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(AppRadius.lg),
                            ),
                            child: Icon(icon, color: color, size: 22),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: color.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(
                                            AppRadius.pill),
                                      ),
                                      child: Text(
                                        category,
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w600,
                                          color: color,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Flexible(
                                      child: Text(
                                        '$size • $date',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.download_rounded,
                                color: AppColors.primary, size: 20),
                            onPressed: () async {
                              if (downloadUrl != null &&
                                  downloadUrl.isNotEmpty) {
                                final uri = Uri.parse(downloadUrl);
                                if (await canLaunchUrl(uri)) {
                                  await launchUrl(uri,
                                      mode: LaunchMode.externalApplication);
                                } else {
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                          content: Text(
                                              'Could not open document URL')),
                                    );
                                  }
                                }
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                        'Viewing dummy/offline document: "$title"'),
                                    backgroundColor: AppColors.info,
                                  ),
                                );
                              }
                            },
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, st) => Center(child: Text('Error: $e')),
            ),
          ),
        ],
      ),
    );
  }
}
