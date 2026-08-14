import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/alert_providers.dart';

class EmergencySosDialog extends ConsumerStatefulWidget {
  const EmergencySosDialog({super.key});

  @override
  ConsumerState<EmergencySosDialog> createState() => _EmergencySosDialogState();
}

class _EmergencySosDialogState extends ConsumerState<EmergencySosDialog> {
  String _selectedType = 'Medical';
  final _notesController = TextEditingController();
  bool _submitting = false;

  final List<Map<String, dynamic>> _sosTypes = [
    {'type': 'Medical', 'icon': Icons.medical_services_rounded, 'color': AppColors.error},
    {'type': 'Fire', 'icon': Icons.local_fire_department_rounded, 'color': Colors.orange},
    {'type': 'Security Threat', 'icon': Icons.shield_rounded, 'color': AppColors.primary},
    {'type': 'Accident', 'icon': Icons.warning_rounded, 'color': Colors.amber},
    {'type': 'Other', 'icon': Icons.sos_rounded, 'color': AppColors.secondary},
  ];

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _triggerSos() async {
    setState(() => _submitting = true);

    try {
      final user = ref.read(currentUserProvider);
      final profile = ref.read(userProfileProvider).value;
      final societyId = profile?['societyId'] ?? 'SOC-001';
      final residentName = profile?['name'] ?? user?.displayName ?? 'Resident';
      final flatNumber = profile?['flatNumber'] ?? 'A-402';
      final phone = profile?['phone'] ?? '+91 98765 43210';

      final success = await ref.read(alertControllerProvider.notifier).broadcastSosAlert(
        societyId: societyId,
        residentUid: user?.uid ?? '',
        residentName: residentName,
        flatNumber: flatNumber,
        phone: phone,
        type: _selectedType,
        notes: _notesController.text.trim(),
      );

      if (mounted) {
        if (success) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Row(
                children: [
                  Icon(Icons.warning_amber_rounded, color: Colors.white),
                  SizedBox(width: 8),
                  Expanded(child: Text('🚨 SOS Alert Sent to Gate Security & Society Admin!')),
                ],
              ),
              backgroundColor: AppColors.error,
              duration: Duration(seconds: 5),
            ),
          );
        } else {
          final errorMsg = ref.read(alertControllerProvider).errorMessage ?? 'Failed to send alert';
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error triggering SOS: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
      title: const Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 28),
          SizedBox(width: 8),
          Text('EMERGENCY SOS ALERT', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.error)),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Select Emergency Type:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _sosTypes.map((t) {
                final isSelected = _selectedType == t['type'];
                return ChoiceChip(
                  label: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(t['icon'] as IconData, size: 16, color: isSelected ? Colors.white : t['color'] as Color),
                      const SizedBox(width: 4),
                      Text(t['type'] as String, style: TextStyle(fontWeight: FontWeight.bold, color: isSelected ? Colors.white : AppColors.textPrimary)),
                    ],
                  ),
                  selected: isSelected,
                  selectedColor: AppColors.error,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedType = t['type'] as String);
                  },
                );
              }).toList(),
            ),

            const SizedBox(height: AppSpacing.md),
            const Text('Additional Details (Optional):', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            TextField(
              controller: _notesController,
              decoration: InputDecoration(
                hintText: 'e.g. Need medical assistance on 4th floor',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton.icon(
          onPressed: _submitting ? null : _triggerSos,
          icon: const Icon(Icons.sos_rounded, color: Colors.white),
          label: const Text('BROADCAST SOS ALERT', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
        ),
      ],
    );
  }
}
