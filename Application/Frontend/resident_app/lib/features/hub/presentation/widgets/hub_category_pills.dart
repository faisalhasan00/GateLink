import 'package:flutter/material.dart';

enum HubCategory {
  all,
  interiors,
  bazaar,
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
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: [
          _buildPill('All Hub', HubCategory.all, Icons.grid_view_rounded),
          _buildPill('🛋️ Interiors & Furniture', HubCategory.interiors, Icons.chair_rounded),
          _buildPill('🏷️ Bazaar (Buy & Sell)', HubCategory.bazaar, Icons.sell_outlined),
          _buildPill('🧹 Maids & Staff', HubCategory.maids, Icons.badge_outlined),
          _buildPill('🔧 Home Repairs', HubCategory.services, Icons.build_outlined),
        ],
      ),
    );
  }

  Widget _buildPill(String label, HubCategory category, IconData icon) {
    final isSelected = selectedCategory == category;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        onTap: () => onSelectCategory(category),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFCBD5E1),
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 14, color: isSelected ? Colors.white : const Color(0xFF475569)),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  color: isSelected ? Colors.white : const Color(0xFF334155),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
