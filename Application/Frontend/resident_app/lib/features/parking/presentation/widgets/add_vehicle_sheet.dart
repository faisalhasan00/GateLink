import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/parking_providers.dart';

class AddVehicleSheet {
  static void show(BuildContext context, WidgetRef ref) {
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
                      initialValue: selectedLevel,
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
}
