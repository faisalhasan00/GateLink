import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/parking_slot_model.dart';
import '../../providers/parking_providers.dart';

class ParkingScreen extends ConsumerWidget {
  const ParkingScreen({super.key});

  void _showAddVehicleModal(BuildContext context, WidgetRef ref) {
    final plateController = TextEditingController();
    final modelController = TextEditingController();
    final slotController = TextEditingController(text: 'B1-P402');
    final colorController = TextEditingController(text: 'White');
    String selectedType = 'Car';
    String selectedLevel = 'Basement 1';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Register Vehicle',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close_rounded, size: 20),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Vehicle Type Switcher
              Row(
                children: [
                  Expanded(
                    child: ChoiceChip(
                      label: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.directions_car_rounded, size: 16),
                          SizedBox(width: 6),
                          Text('4-Wheeler'),
                        ],
                      ),
                      selected: selectedType == 'Car',
                      selectedColor: const Color(0xFF1E3A8A),
                      labelStyle: TextStyle(
                        color: selectedType == 'Car' ? Colors.white : const Color(0xFF475569),
                        fontWeight: FontWeight.w700,
                      ),
                      onSelected: (val) {
                        if (val) setModalState(() => selectedType = 'Car');
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ChoiceChip(
                      label: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.two_wheeler_rounded, size: 16),
                          SizedBox(width: 6),
                          Text('2-Wheeler'),
                        ],
                      ),
                      selected: selectedType == 'Two Wheeler',
                      selectedColor: const Color(0xFF1E3A8A),
                      labelStyle: TextStyle(
                        color: selectedType == 'Two Wheeler' ? Colors.white : const Color(0xFF475569),
                        fontWeight: FontWeight.w700,
                      ),
                      onSelected: (val) {
                        if (val) setModalState(() => selectedType = 'Two Wheeler');
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: plateController,
                textCapitalization: TextCapitalization.characters,
                decoration: InputDecoration(
                  labelText: 'Vehicle Registration Number',
                  hintText: 'e.g. MH 12 AB 1234',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.pin_rounded, size: 20),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: modelController,
                      decoration: InputDecoration(
                        labelText: 'Model & Make',
                        hintText: 'e.g. Honda City',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: colorController,
                      decoration: InputDecoration(
                        labelText: 'Color',
                        hintText: 'e.g. Silver',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: slotController,
                      decoration: InputDecoration(
                        labelText: 'Parking Slot ID',
                        hintText: 'e.g. B1-P402',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: selectedLevel,
                      decoration: InputDecoration(
                        labelText: 'Level',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'Basement 1', child: Text('Basement 1')),
                        DropdownMenuItem(value: 'Basement 2', child: Text('Basement 2')),
                        DropdownMenuItem(value: 'Ground Stilt', child: Text('Ground Stilt')),
                        DropdownMenuItem(value: 'Open Visitor', child: Text('Open Visitor')),
                      ],
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedLevel = val);
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    final plate = plateController.text.trim();
                    if (plate.isEmpty) return;

                    final user = ref.read(currentUserProvider);
                    final profile = ref.read(userProfileProvider).value;
                    final activeSocId = profile?.societyId ?? 'SOC-001';
                    if (user == null) return;

                    final repo = ref.read(parkingRepositoryProvider);
                    await repo.addVehicle(
                      societyId: activeSocId,
                      uid: user.uid,
                      slot: slotController.text.trim().isNotEmpty ? slotController.text.trim() : 'Slot A-01',
                      level: selectedLevel,
                      number: plate,
                      type: selectedType,
                      model: modelController.text.trim().isNotEmpty ? modelController.text.trim() : 'Private Vehicle',
                      color: colorController.text.trim().isNotEmpty ? colorController.text.trim() : 'Color',
                    );

                    if (ctx.mounted) {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('🚗 Vehicle $plate registered successfully!'),
                          backgroundColor: const Color(0xFF10B981),
                        ),
                      );
                    }
                  },
                  icon: const Icon(Icons.check_rounded, size: 18),
                  label: const Text('Save & Activate RFID Pass'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E3A8A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

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
            onPressed: () => _showAddVehicleModal(context, ref),
            icon: const Icon(Icons.add_rounded, color: Color(0xFF1E3A8A)),
            tooltip: 'Register New Vehicle',
          ),
        ],
      ),
      body: parkingAsync.when(
        data: (slots) {
          if (slots.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        color: Color(0xFFEFF6FF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.directions_car_rounded,
                        size: 48,
                        color: Color(0xFF1E3A8A),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'No Vehicles Registered',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Register your car or two-wheeler to link automatic Boom Barrier RFID gate entry & assigned parking slots.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => _showAddVehicleModal(context, ref),
                          icon: const Icon(Icons.add_rounded, size: 18),
                          label: const Text('Add Vehicle'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1E3A8A),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                        const SizedBox(width: 12),
                        OutlinedButton.icon(
                          onPressed: () async {
                            if (user == null) return;
                            final repo = ref.read(parkingRepositoryProvider);
                            await repo.seedDemoVehicles(activeSocId, user.uid);
                          },
                          icon: const Icon(Icons.flash_on_rounded, size: 18),
                          label: const Text('Load Demo Passes'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF1E3A8A),
                            side: const BorderSide(color: Color(0xFF1E3A8A)),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: slots.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final slot = slots[index];
              return _VehicleCard(slot: slot);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF1E3A8A))),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _VehicleCard extends StatelessWidget {
  final ParkingSlotModel slot;

  const _VehicleCard({required this.slot});

  @override
  Widget build(BuildContext context) {
    final isCar = slot.type.toLowerCase() == 'car';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header: Slot & Status
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.local_parking_rounded, size: 14, color: Color(0xFF1E3A8A)),
                      const SizedBox(width: 5),
                      Text(
                        slot.slot,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E3A8A),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  slot.level,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.sensors_rounded, size: 12, color: Color(0xFF059669)),
                      SizedBox(width: 4),
                      Text(
                        'RFID Active',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF059669),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),

          // Body: Vehicle Details
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Icon(
                    isCar ? Icons.directions_car_filled_rounded : Icons.two_wheeler_rounded,
                    color: const Color(0xFF1E3A8A),
                    size: 26,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // High-contrast License Plate Banner
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          slot.number,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${slot.model} • ${slot.color}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

