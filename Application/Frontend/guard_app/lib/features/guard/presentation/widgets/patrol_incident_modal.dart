import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/patrol_checkpoint_model.dart';
import '../../providers/patrol_providers.dart';

class PatrolIncidentModal extends ConsumerStatefulWidget {
  final PatrolCheckpointModel? checkpoint;

  const PatrolIncidentModal({super.key, this.checkpoint});

  static Future<void> show(BuildContext context, {PatrolCheckpointModel? checkpoint}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => PatrolIncidentModal(checkpoint: checkpoint),
    );
  }

  @override
  ConsumerState<PatrolIncidentModal> createState() => _PatrolIncidentModalState();
}

class _PatrolIncidentModalState extends ConsumerState<PatrolIncidentModal> {
  final _descriptionController = TextEditingController();
  String _selectedCategory = 'Light Failure / Electrical';
  String _selectedSeverity = 'medium';
  bool _isSubmitting = false;

  final List<String> _categories = [
    'Light Failure / Electrical',
    'Broken Lock / Open Gate',
    'Water Leakage / Pipe Burst',
    'Suspicious Person / Vehicle',
    'Fire Hazard / Smoke',
    'Unauthorized Parking',
    'Noise / Resident Disturbance',
    'Other Security Hazard',
  ];

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitIncident() async {
    final desc = _descriptionController.text.trim();
    if (desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please describe the incident')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final userProfile = ref.read(userProfileProvider).value;
      final authState = ref.read(authStateProvider).value;
      final societyId = userProfile?['societyId'] as String? ?? '';
      final guardUid = authState?.uid ?? '';
      final guardName = (userProfile?['name'] as String?) ?? 'Security Guard';

      final repo = ref.read(patrolRepositoryProvider);
      await repo.reportIncident(
        societyId: societyId,
        checkpointId: widget.checkpoint?.id,
        checkpointCode: widget.checkpoint?.code,
        checkpointName: widget.checkpoint?.name,
        guardUid: guardUid,
        guardName: guardName,
        category: _selectedCategory,
        severity: _selectedSeverity,
        description: desc,
      );

      if (!mounted) return;
      Navigator.of(context).pop();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              Text('Patrol Incident reported to Society Admin'),
            ],
          ),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.lg,
        bottom: AppSpacing.lg + bottomInset,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Report Patrol Incident',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                      ),
                      Text(
                        widget.checkpoint != null
                            ? 'Location: ${widget.checkpoint!.code} - ${widget.checkpoint!.name}'
                            : 'On-Ground Security Observation',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Category Selector
            const Text(
              'Incident Category',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedCategory,
                  isExpanded: true,
                  items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 13.5)))).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedCategory = val);
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Severity Level
            const Text(
              'Severity Level',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildSeverityChip('low', 'Low', AppColors.success),
                const SizedBox(width: 8),
                _buildSeverityChip('medium', 'Medium', AppColors.warning),
                const SizedBox(width: 8),
                _buildSeverityChip('critical', 'Critical / Urgent', AppColors.error),
              ],
            ),
            const SizedBox(height: 16),

            // Incident Description
            const Text(
              'Incident Details / Observation *',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _descriptionController,
              maxLines: 3,
              style: const TextStyle(fontSize: 13.5),
              decoration: InputDecoration(
                hintText: 'e.g. Broken streetlight near boundary wall. Exposed wiring visible.',
                hintStyle: const TextStyle(fontSize: 13, color: AppColors.gray400),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary, width: 1.5)),
                contentPadding: const EdgeInsets.all(12),
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitIncident,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Submit Incident Alert', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSeverityChip(String value, String label, Color color) {
    final isSelected = _selectedSeverity == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedSeverity = value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? color.withOpacity(0.12) : AppColors.surface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? color : AppColors.border,
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? color : AppColors.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
