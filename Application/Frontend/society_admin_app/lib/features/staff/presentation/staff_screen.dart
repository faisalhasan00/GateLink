import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/facility_models.dart';

class StaffScreen extends ConsumerWidget {
  const StaffScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final staffAsync = ref.watch(staffStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Staff & Security Guards'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add_alt_1),
        label: const Text('Add Staff'),
        onPressed: () {
          if (society != null) _showAddStaffModal(context, ref, society.id);
        },
      ),
      body: staffAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading staff & guards roster...'),
        error: (err, _) => ErrorStateWidget(message: err.toString()),
        data: (staffList) {
          if (staffList.isEmpty) {
            return EmptyStateWidget(
              title: 'No Staff Registered',
              description: 'Onboard security guards, facility managers, and electricians.',
              icon: Icons.badge_outlined,
              actionLabel: 'Add Staff Member',
              onAction: () {
                if (society != null) _showAddStaffModal(context, ref, society.id);
              },
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: staffList.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final staff = staffList[index];
              final isOnDuty = staff.status == 'on_duty';

              return AppCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 22,
                      backgroundColor: staff.role.toLowerCase().contains('guard')
                          ? AppColors.skyLight
                          : AppColors.purpleLight,
                      child: Icon(
                        staff.role.toLowerCase().contains('guard') ? Icons.shield : Icons.engineering,
                        color: staff.role.toLowerCase().contains('guard')
                            ? AppColors.secondarySky
                            : AppColors.purple,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            staff.name,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${staff.role} • ${staff.shift}',
                            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                          ),
                          Text(
                            staff.phone,
                            style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    Switch(
                      value: isOnDuty,
                      activeTrackColor: AppColors.successEmerald,
                      onChanged: (val) async {
                        if (society != null) {
                          await ref.read(firestoreServiceProvider).updateStaffStatus(
                                society.id,
                                staff.id,
                                val ? 'on_duty' : 'off_duty',
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
      ),
    );
  }

  void _showAddStaffModal(BuildContext context, WidgetRef ref, String societyId) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    String selectedRole = 'Guard';
    String selectedShift = 'Morning (6am-2pm)';

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
                  const Text('Onboard Staff / Security Guard', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 16),
                  AppTextField(controller: nameCtrl, label: 'Full Name', hintText: 'e.g. Ramesh Kumar'),
                  const SizedBox(height: 12),
                  AppTextField(controller: phoneCtrl, label: 'Phone Number', hintText: '9876543210', keyboardType: TextInputType.phone),
                  const SizedBox(height: 12),
                  const Text('Designation / Role', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: selectedRole,
                    decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
                    items: const [
                      DropdownMenuItem(value: 'Guard', child: Text('Security Guard')),
                      DropdownMenuItem(value: 'Head Guard', child: Text('Head Guard / Supervisor')),
                      DropdownMenuItem(value: 'Electrician', child: Text('Electrician')),
                      DropdownMenuItem(value: 'Plumber', child: Text('Plumber')),
                      DropdownMenuItem(value: 'Facility Manager', child: Text('Facility Manager')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedRole = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  const Text('Assigned Shift', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: selectedShift,
                    decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
                    items: const [
                      DropdownMenuItem(value: 'Morning (6am-2pm)', child: Text('Morning (6am-2pm)')),
                      DropdownMenuItem(value: 'Evening (2pm-10pm)', child: Text('Evening (2pm-10pm)')),
                      DropdownMenuItem(value: 'Night (10pm-6am)', child: Text('Night (10pm-6am)')),
                      DropdownMenuItem(value: 'General (9am-6pm)', child: Text('General (9am-6pm)')),
                    ],
                    onChanged: (val) {
                      if (val != null) setModalState(() => selectedShift = val);
                    },
                  ),
                  const SizedBox(height: 20),
                  AppButton(
                    label: 'Onboard Staff Member',
                    width: double.infinity,
                    onPressed: () async {
                      if (nameCtrl.text.trim().isEmpty) return;
                      final staff = StaffModel(
                        id: '',
                        name: nameCtrl.text.trim(),
                        phone: phoneCtrl.text.trim(),
                        role: selectedRole,
                        shift: selectedShift,
                      );
                      await ref.read(firestoreServiceProvider).addStaff(societyId, staff);
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
