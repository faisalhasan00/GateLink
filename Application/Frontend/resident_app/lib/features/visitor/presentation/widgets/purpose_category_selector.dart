import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_spacing.dart';

class PurposeCategorySelector extends StatelessWidget {
  final bool isSingle;
  final String selectedPurpose;
  final ValueChanged<String> onPurposeSelected;
  final ValueChanged<int>? onPresetDaysSelected;

  const PurposeCategorySelector({
    super.key,
    required this.isSingle,
    required this.selectedPurpose,
    required this.onPurposeSelected,
    this.onPresetDaysSelected,
  });

  static const List<Map<String, dynamic>> multiDayPresets = [
    {'label': '👨‍👩‍👧 Family Stay', 'purpose': 'Guest Stay', 'days': 7},
    {'label': '🏠 Relative Visit', 'purpose': 'Guest Stay', 'days': 3},
    {'label': '📚 Regular Tutor', 'purpose': 'House Help', 'days': 30},
    {'label': '🔨 Renovation Contractor', 'purpose': 'Maintenance Work', 'days': 14},
  ];

  Widget _buildCategoryTab({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: () {
          HapticFeedback.selectionClick();
          onTap();
        },
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFCBD5E1),
              width: isSelected ? 1.5 : 1.0,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFF1E3A8A).withValues(alpha: 0.25),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? Colors.white : const Color(0xFF475569),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  color: isSelected ? Colors.white : const Color(0xFF334155),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isSingle) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'VISITING PURPOSE',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.8,
              color: Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              _buildCategoryTab(
                label: 'Guest / Friend',
                icon: Icons.people_alt_outlined,
                isSelected: selectedPurpose == 'Guest / Friend' || selectedPurpose == 'Personal Visit',
                onTap: () => onPurposeSelected('Guest / Friend'),
              ),
              const SizedBox(width: 8),
              _buildCategoryTab(
                label: 'Delivery',
                icon: Icons.delivery_dining_outlined,
                isSelected: selectedPurpose == 'Delivery',
                onTap: () => onPurposeSelected('Delivery'),
              ),
              const SizedBox(width: 8),
              _buildCategoryTab(
                label: 'Cab / Taxi',
                icon: Icons.local_taxi_outlined,
                isSelected: selectedPurpose == 'Cab / Taxi',
                onTap: () => onPurposeSelected('Cab / Taxi'),
              ),
              const SizedBox(width: 8),
              _buildCategoryTab(
                label: 'Service',
                icon: Icons.build_outlined,
                isSelected: selectedPurpose == 'Maintenance Work',
                onTap: () => onPurposeSelected('Maintenance Work'),
              ),
            ],
          ),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'STAY PURPOSE',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.8,
            color: Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: multiDayPresets.map((preset) {
            final label = preset['label'] as String;
            final purpose = preset['purpose'] as String;
            final isSelected = selectedPurpose == purpose;

            return ChoiceChip(
              label: Text(label),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) {
                  HapticFeedback.selectionClick();
                  onPurposeSelected(purpose);
                  if (preset['days'] != null && onPresetDaysSelected != null) {
                    onPresetDaysSelected!(preset['days'] as int);
                  }
                }
              },
              selectedColor: const Color(0xFF0EA5E9),
              labelStyle: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isSelected ? Colors.white : const Color(0xFF334155),
              ),
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: BorderSide(
                  color: isSelected ? Colors.transparent : const Color(0xFFCBD5E1),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
