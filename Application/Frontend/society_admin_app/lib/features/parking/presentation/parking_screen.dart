import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/facility_models.dart';

class ParkingScreen extends ConsumerWidget {
  const ParkingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final parkingAsync = ref.watch(parkingSlotsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Parking Slot Management'),
      ),
      body: parkingAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading parking allocations...'),
        error: (err, _) => ErrorStateWidget(message: err.toString()),
        data: (slots) {
          if (slots.isEmpty) {
            return const EmptyStateWidget(
              title: 'No Parking Slots Configured',
              description: 'Parking slots configured in the society will appear here.',
              icon: Icons.local_parking_outlined,
            );
          }

          final occupied = slots.where((s) => s.isOccupied).length;
          final vacant = slots.length - occupied;

          return Column(
            children: [
              // Summary Banner
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: AppCard(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Allocated Slots', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            const SizedBox(height: 4),
                            Text('$occupied', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: AppCard(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Vacant Slots', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            const SizedBox(height: 4),
                            Text('$vacant', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.successEmerald)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Slots List
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: slots.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final slot = slots[index];
                    return AppCard(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: slot.isOccupied ? AppColors.skyLight : AppColors.emeraldLight,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              slot.slotNumber,
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 15,
                                color: slot.isOccupied ? AppColors.primaryNavy : AppColors.successEmerald,
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  slot.isOccupied ? 'Assigned: Flat ${slot.assignedFlat}' : 'Vacant Slot',
                                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                                ),
                                if (slot.residentName.isNotEmpty) ...[
                                  const SizedBox(height: 2),
                                  Text(
                                    '${slot.residentName} • ${slot.vehicleNumber}',
                                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                  ),
                                ],
                                const SizedBox(height: 2),
                                Text(
                                  slot.slotType,
                                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, size: 20, color: AppColors.textMuted),
                            onPressed: () {
                              if (society != null) _showEditSlotModal(context, ref, society.id, slot);
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showEditSlotModal(BuildContext context, WidgetRef ref, String societyId, ParkingSlotModel slot) {
    final flatCtrl = TextEditingController(text: slot.assignedFlat);
    final nameCtrl = TextEditingController(text: slot.residentName);
    final vehCtrl = TextEditingController(text: slot.vehicleNumber);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Assign Slot: ${slot.slotNumber}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 16),
              AppTextField(controller: flatCtrl, label: 'Assigned Flat (or leave empty to deallocate)', hintText: 'e.g. A-402'),
              const SizedBox(height: 12),
              AppTextField(controller: nameCtrl, label: 'Resident Name', hintText: 'Resident Name'),
              const SizedBox(height: 12),
              AppTextField(controller: vehCtrl, label: 'Vehicle Number', hintText: 'MH 02 AB 1234'),
              const SizedBox(height: 20),
              AppButton(
                label: 'Save Assignment',
                width: double.infinity,
                onPressed: () async {
                  await ref.read(firestoreServiceProvider).assignParkingSlot(
                        societyId,
                        slot.id,
                        flatCtrl.text.trim(),
                        nameCtrl.text.trim(),
                        vehCtrl.text.trim(),
                      );
                  if (ctx.mounted) Navigator.of(ctx).pop();
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
