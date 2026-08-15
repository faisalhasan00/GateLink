import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';
import '../../../../core/services/firestore_service.dart';

class EntryFlatSelector extends StatelessWidget {
  final String selectedTower;
  final List<String> towers;
  final TextEditingController flatController;
  final bool isValidating;
  final FlatValidationResult? validationResult;
  final ValueChanged<String> onTowerChanged;
  final ValueChanged<String> onFlatChanged;

  const EntryFlatSelector({
    super.key,
    required this.selectedTower,
    required this.towers,
    required this.flatController,
    required this.isValidating,
    required this.validationResult,
    required this.onTowerChanged,
    required this.onFlatChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Block / Tower',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    isExpanded: true,
                    value: selectedTower,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                    ),
                    items: towers
                        .map((t) => DropdownMenuItem(
                              value: t,
                              child: Text(
                                t,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12),
                              ),
                            ))
                        .toList(),
                    onChanged: (v) {
                      if (v != null) onTowerChanged(v);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              flex: 3,
              child: AppTextField(
                label: 'Flat No.',
                isRequired: true,
                controller: flatController,
                keyboardType: TextInputType.number,
                hintText: 'e.g. 101',
                prefixIcon: Icons.home_outlined,
                onChanged: onFlatChanged,
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Required' : null,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        if (isValidating)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 4),
            child: Row(children: [
              SizedBox(
                width: 14,
                height: 14,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
              SizedBox(width: 8),
              Text(
                'Validating flat assignment...',
                style:
                    TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
            ]),
          )
        else if (validationResult != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: validationResult!.isValid
                  ? AppColors.successSurface.withValues(alpha: 0.2)
                  : AppColors.errorSurface.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(
                color: validationResult!.isValid
                    ? AppColors.success
                    : AppColors.error,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  validationResult!.isValid
                      ? Icons.check_circle_rounded
                      : Icons.error_rounded,
                  size: 16,
                  color: validationResult!.isValid
                      ? AppColors.success
                      : AppColors.error,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    validationResult!.isValid
                        ? 'Resident: ${validationResult!.residentName ?? ""}'
                        : (validationResult!.error ?? 'Invalid Flat'),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: validationResult!.isValid
                          ? AppColors.success
                          : AppColors.error,
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
