import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/parking_providers.dart';
import '../widgets/add_vehicle_sheet.dart';
import '../widgets/vehicle_card.dart';
import '../widgets/parking_empty_state.dart';

class ParkingScreen extends ConsumerWidget {
  const ParkingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final parkingAsync = ref.watch(parkingSlotsStreamProvider);
    final user = ref.watch(currentUserProvider);
    final profile = ref.watch(userProfileProvider).value;
    final activeSocId = profile?.societyId ?? 'SOC-001';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
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
        title: const Text(
          'My Vehicles & Parking',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => AddVehicleSheet.show(context, ref),
            icon: const Icon(Icons.add_rounded, color: Color(0xFF1E3A8A)),
            tooltip: 'Register New Vehicle',
          ),
        ],
      ),
      body: parkingAsync.when(
        data: (slots) {
          if (slots.isEmpty) {
            return ParkingEmptyState(
              onAddVehicle: () => AddVehicleSheet.show(context, ref),
              onLoadDemo: () async {
                if (user == null) return;
                final repo = ref.read(parkingRepositoryProvider);
                await repo.seedDemoVehicles(activeSocId, user.uid);
              },
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: slots.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final slot = slots[index];
              return VehicleCard(slot: slot);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF1E3A8A))),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
