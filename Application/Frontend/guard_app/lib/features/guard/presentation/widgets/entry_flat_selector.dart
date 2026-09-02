import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
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

  Future<void> _callResident(String phone) async {
    if (phone.isEmpty) return;
    final clean = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    final uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

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
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    isExpanded: true,
                    value: selectedTower,
                    decoration: InputDecoration(
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 14),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                    items: towers
                        .map((t) => DropdownMenuItem(
                              value: t,
                              child: Text(
                                t,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
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
                keyboardType: TextInputType.text,
                hintText: 'e.g. 101 or 402',
                prefixIcon: Icons.home_outlined,
                onChanged: onFlatChanged,
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Flat number is required' : null,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        if (isValidating)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 6),
            child: Row(children: [
              SizedBox(
                width: 14,
                height: 14,
                child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF1E3A8A)),
              ),
              SizedBox(width: 8),
              Text(
                'Looking up resident in directory...',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
              ),
            ]),
          )
        else if (validationResult != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: validationResult!.isValid
                  ? const Color(0xFFECFDF5)
                  : const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: validationResult!.isValid
                    ? const Color(0xFF6EE7B7)
                    : const Color(0xFFFCA5A5),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  validationResult!.isValid
                      ? Icons.check_circle_rounded
                      : Icons.error_outline_rounded,
                  size: 18,
                  color: validationResult!.isValid
                      ? const Color(0xFF059669)
                      : const Color(0xFFDC2626),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        validationResult!.isValid
                            ? 'Resident: ${validationResult!.residentName ?? "Registered Resident"}'
                            : (validationResult!.error ?? 'Invalid Flat / Not Found'),
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: validationResult!.isValid
                              ? const Color(0xFF065F46)
                              : const Color(0xFF991B1B),
                        ),
                      ),
                      if (validationResult!.isValid)
                        const Text(
                          'Verified Society Occupant',
                          style: TextStyle(fontSize: 10.5, color: Color(0xFF059669), fontWeight: FontWeight.w500),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
