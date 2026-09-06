import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/facility_models.dart';

class HelpersScreen extends ConsumerWidget {
  const HelpersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final helpersAsync = ref.watch(helpersStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Daily Help & Service Providers'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Register Helper'),
        onPressed: () {
          if (society != null) _showAddHelperModal(context, ref, society.id);
        },
      ),
      body: helpersAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading daily helpers directory...'),
        error: (err, _) => ErrorStateWidget(message: err.toString()),
        data: (helpers) {
          if (helpers.isEmpty) {
            return EmptyStateWidget(
              title: 'No Daily Helpers Registered',
              description: 'Register house maids, cooks, drivers, and service partners.',
              icon: Icons.cleaning_services_outlined,
              actionLabel: 'Register Daily Help',
              onAction: () {
                if (society != null) _showAddHelperModal(context, ref, society.id);
              },
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: helpers.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final helper = helpers[index];
              return AppCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 22,
                      backgroundColor: AppColors.amberLight,
                      child: Icon(Icons.person, color: AppColors.accentAmber, size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            helper.name,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${helper.helperType} • ${helper.phone}',
                            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                          ),
                          if (helper.assignedFlats.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(
                              'Flats: ${helper.assignedFlats}',
                              style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                            ),
                          ],
                        ],
                      ),
                    ),
                    AppBadge(
                      label: helper.status.toUpperCase(),
                      variant: helper.status == 'inside' ? BadgeVariant.success : BadgeVariant.neutral,
                      fontSize: 10,
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

  void _showAddHelperModal(BuildContext context, WidgetRef ref, String societyId) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final flatsCtrl = TextEditingController();
    String selectedType = 'Maid';

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
                  const Text('Register Daily Helper', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 16),
                  AppTextField(controller: nameCtrl, label: 'Helper Name', hintText: 'e.g. Sunita Devi'),
                  const SizedBox(height: 12),
                  AppTextField(controller: phoneCtrl, label: 'Phone Number', hintText: '9876543210', keyboardType: TextInputType.phone),
                  const SizedBox(height: 12),
                  const Text('Service Type', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: selectedType,
                    decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
                    items: const [
                      DropdownMenuItem(value: 'Maid', child: Text('House Maid / Cleaning')),
                      DropdownMenuItem(value: 'Cook', child: Text('Cook / Chef')),
                      DropdownMenuItem(value: 'Driver', child: Text('Personal Driver')),
                      DropdownMenuItem(value: 'Nanny', child: Text('Babysitter / Nanny')),
                      DropdownMenuItem(value: 'Car Cleaner', child: Text('Car Cleaner')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedType = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  AppTextField(controller: flatsCtrl, label: 'Working Flats (Comma Separated)', hintText: 'e.g. A-101, B-402'),
                  const SizedBox(height: 20),
                  AppButton(
                    label: 'Register & Issue Passcode',
                    width: double.infinity,
                    onPressed: () async {
                      if (nameCtrl.text.trim().isEmpty) return;
                      final helper = HelperModel(
                        id: '',
                        name: nameCtrl.text.trim(),
                        phone: phoneCtrl.text.trim(),
                        helperType: selectedType,
                        assignedFlats: flatsCtrl.text.trim(),
                      );
                      await ref.read(firestoreServiceProvider).addHelper(societyId, helper);
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
