import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

enum HubCategory {
  bazaar,
  interiors,
  maids,
  services,
}

class HubCategoryPills extends StatelessWidget {
  final HubCategory selectedCategory;
  final ValueChanged<HubCategory> onSelectCategory;

  const HubCategoryPills({
    super.key,
    required this.selectedCategory,
    required this.onSelectCategory,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(4),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: [
            _buildSegmentButton(
              label: 'Bazaar (Buy & Sell)',
              category: HubCategory.bazaar,
              icon: Icons.sell_outlined,
              activeColor: const Color(0xFF16A34A),
            ),
            const SizedBox(width: 4),
            _buildSegmentButton(
              label: 'Interiors & Furniture',
              category: HubCategory.interiors,
              icon: Icons.chair_outlined,
              activeColor: const Color(0xFF9333EA),
            ),
            const SizedBox(width: 4),
            _buildSegmentButton(
              label: 'Maids & Staff',
              category: HubCategory.maids,
              icon: Icons.badge_outlined,
              activeColor: const Color(0xFF0284C7),
            ),
            const SizedBox(width: 4),
            _buildSegmentButton(
              label: 'Home Repairs',
              category: HubCategory.services,
              icon: Icons.build_outlined,
              activeColor: const Color(0xFFD97706),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSegmentButton({
    required String label,
    required HubCategory category,
    required IconData icon,
    required Color activeColor,
  }) {
    final isSelected = selectedCategory == category;
    return GestureDetector(
      onTap: () => onSelectCategory(category),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 15,
              color: isSelected ? activeColor : const Color(0xFF64748B),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
