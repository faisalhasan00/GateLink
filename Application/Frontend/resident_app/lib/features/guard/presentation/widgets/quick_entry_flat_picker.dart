import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/services/firestore_service.dart';

class QuickEntryFlatPicker extends StatelessWidget {
  final String selectedTower;
  final List<String> towers;
  final TextEditingController flatController;
  final bool isValidatingFlat;
  final FlatValidationResult? flatValidationResult;
  final ValueChanged<String?> onTowerChanged;
  final ValueChanged<String> onFlatChanged;

  const QuickEntryFlatPicker({
    super.key,
    required this.selectedTower,
    required this.towers,
    required this.flatController,
    required this.isValidatingFlat,
    required this.flatValidationResult,
    required this.onTowerChanged,
    required this.onFlatChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              flex: 4,
              child: DropdownButtonFormField<String>(
                value: selectedTower,
                decoration: const InputDecoration(
                  labelText: 'Building Block',
                  contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                ),
                items: towers
                    .map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 12))))
                    .toList(),
                onChanged: onTowerChanged,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              flex: 5,
              child: TextFormField(
                controller: flatController,
                keyboardType: TextInputType.text,
                decoration: InputDecoration(
                  labelText: 'Flat Number',
                  hintText: 'e.g. 104',
                  suffixIcon: isValidatingFlat
                      ? const Padding(
                          padding: EdgeInsets.all(12),
                          child: SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
                        )
                      : null,
                ),
                onChanged: onFlatChanged,
                validator: (v) => v == null || v.trim().isEmpty ? 'Flat is required' : null,
              ),
            ),
          ],
        ),
        if (flatValidationResult != null) ...[
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: flatValidationResult!.isValid ? AppColors.successSurface : AppColors.errorSurface,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: flatValidationResult!.isValid ? AppColors.success : AppColors.error),
            ),
            child: Row(
              children: [
                Icon(
                  flatValidationResult!.isValid ? Icons.check_circle_rounded : Icons.error_outline_rounded,
                  color: flatValidationResult!.isValid ? AppColors.success : AppColors.error,
                  size: 16,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    flatValidationResult!.isValid
                        ? 'Verified Resident: ${flatValidationResult!.residentName}'
                        : flatValidationResult!.error ?? 'Flat not found in society database',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: flatValidationResult!.isValid ? AppColors.success : AppColors.error,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}
