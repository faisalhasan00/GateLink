import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';

class ParkingScreen extends ConsumerWidget {
  const ParkingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final parkingAsync = ref.watch(parkingStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Family & Vehicles'),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.add_rounded),
            tooltip: 'Add Member / Vehicle',
          ),
        ],
      ),
      body: parkingAsync.when(
        data: (snapshot) {
          if (snapshot.docs.isEmpty) {
            return const Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Icon(Icons.directions_car_rounded, size: 56, color: AppColors.textDisabled),
                SizedBox(height: AppSpacing.md),
                Text('No vehicles registered', style: TextStyle(color: AppColors.textSecondary)),
              ]),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: snapshot.docs.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final data = snapshot.docs[index].data() as Map<String, dynamic>;
              return _VehicleCard(
                slot: data['slot'] ?? 'Unknown Slot',
                level: data['level'] ?? 'Level',
                number: data['number'] ?? 'XX 00 XX 0000',
                type: data['type'] ?? 'Car',
                model: data['model'] ?? 'Unknown Model',
                color: data['color'] ?? 'Color',
                status: data['status'] ?? 'Active',
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _VehicleCard extends StatelessWidget {
  final String slot, level, number, type, model, color, status;

  const _VehicleCard({
    required this.slot, required this.level, required this.number,
    required this.type, required this.model, required this.color, required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final isCar = type.toLowerCase() == 'car';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          // Header: Slot & Status
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primarySurface,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  child: Row(children: [
                    const Icon(Icons.local_parking_rounded, size: 14, color: AppColors.primary),
                    const SizedBox(width: 6),
                    Text(slot, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
                  ]),
                ),
                const SizedBox(width: AppSpacing.sm),
                Text(level, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: status == 'Active' ? AppColors.success.withOpacity(0.1) : AppColors.textSecondary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(status, style: TextStyle(
                    fontSize: 11, fontWeight: FontWeight.w600,
                    color: status == 'Active' ? AppColors.success : AppColors.textSecondary,
                  )),
                ),
              ],
            ),
          ),
          const Divider(height: 0),
          // Body: Vehicle Details
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.gray100,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Icon(
                    isCar ? Icons.directions_car_rounded : Icons.two_wheeler_rounded,
                    color: AppColors.textSecondary,
                    size: 32,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: AppColors.textSecondary, width: 1.5),
                      ),
                      child: Text(number, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary, letterSpacing: 1)),
                    ),
                    const SizedBox(height: 8),
                    Text('$color • $model', style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                  ],
                )),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.more_vert_rounded, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
