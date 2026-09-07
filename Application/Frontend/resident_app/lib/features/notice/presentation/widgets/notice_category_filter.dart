import 'package:flutter/material.dart';

class NoticeCategoryFilter extends StatelessWidget {
  final List<String> categories;
  final String selectedCategory;
  final ValueChanged<String> onCategorySelected;

  const NoticeCategoryFilter({
    super.key,
    required this.categories,
    required this.selectedCategory,
    required this.onCategorySelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      color: Colors.white,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = categories[index];
          final isSelected = selectedCategory == cat;

          return ChoiceChip(
            label: Text(
              cat == 'Emergency'
                  ? '🚨 Emergency'
                  : cat == 'Maintenance'
                      ? '🔧 Maintenance'
                      : cat == 'Events'
                          ? '🎉 Events'
                          : cat == 'General'
                              ? '📢 General'
                              : '📋 All',
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? Colors.white : const Color(0xFF475569),
              ),
            ),
            selected: isSelected,
            selectedColor: const Color(0xFF1E3A8A),
            backgroundColor: const Color(0xFFF1F5F9),
            showCheckmark: false,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(999),
              side: BorderSide(
                color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFE2E8F0),
              ),
            ),
            onSelected: (_) => onCategorySelected(cat),
          );
        },
      ),
    );
  }
}
