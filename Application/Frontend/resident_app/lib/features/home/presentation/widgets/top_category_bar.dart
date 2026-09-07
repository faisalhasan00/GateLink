import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum ResidentHomeCategory {
  society,
  maidsSalon,
  services,
  interiors,
  bazaar,
}

class TopCategoryBar extends StatelessWidget {
  final ResidentHomeCategory selectedCategory;
  final ValueChanged<ResidentHomeCategory> onCategoryChanged;

  const TopCategoryBar({
    super.key,
    required this.selectedCategory,
    required this.onCategoryChanged,
  });

  static const List<_SwiggyCategoryMeta> _categories = [
    _SwiggyCategoryMeta(
      category: ResidentHomeCategory.society,
      label: 'Society',
      emoji: '🏛️',
      icon: Icons.apartment_rounded,
    ),
    _SwiggyCategoryMeta(
      category: ResidentHomeCategory.maidsSalon,
      label: 'Maids',
      emoji: '✨',
      icon: Icons.auto_awesome_rounded,
    ),
    _SwiggyCategoryMeta(
      category: ResidentHomeCategory.services,
      label: 'Services',
      emoji: '🔧',
      icon: Icons.handyman_rounded,
    ),
    _SwiggyCategoryMeta(
      category: ResidentHomeCategory.interiors,
      label: 'Interiors',
      emoji: '🛋️',
      icon: Icons.weekend_rounded,
    ),
    _SwiggyCategoryMeta(
      category: ResidentHomeCategory.bazaar,
      label: 'Bazaar',
      emoji: '🛍️',
      icon: Icons.storefront_rounded,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 86,
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF070D1F), // Swiggy-style deep midnight navy base
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: _categories.map((item) {
          final isSelected = item.category == selectedCategory;
          return Expanded(
            child: _SwiggyTabItem(
              item: item,
              isSelected: isSelected,
              onTap: () {
                HapticFeedback.lightImpact();
                onCategoryChanged(item.category);
              },
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _SwiggyTabItem extends StatelessWidget {
  final _SwiggyCategoryMeta item;
  final bool isSelected;
  final VoidCallback onTap;

  const _SwiggyTabItem({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeInOutCubic,
        margin: const EdgeInsets.symmetric(horizontal: 2.5),
        decoration: isSelected
            ? BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF1E3A8A), // Top active navy highlight
                    Color(0xFF0F172A), // Deep smooth fade
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                  bottom: Radius.circular(12),
                ),
                border: Border(
                  top: const BorderSide(
                    color: Color(0xFF60A5FA), // Glowing top curve border
                    width: 2.2,
                  ),
                  left: BorderSide(
                    color: Colors.white.withValues(alpha: 0.15),
                    width: 1,
                  ),
                  right: BorderSide(
                    color: Colors.white.withValues(alpha: 0.15),
                    width: 1,
                  ),
                  bottom: BorderSide.none,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.35),
                    blurRadius: 12,
                    offset: const Offset(0, -2),
                  ),
                ],
              )
            : BoxDecoration(
                color: const Color(0xFF131C35).withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.04),
                  width: 1,
                ),
              ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Top 3D / Rich Visual Icon
            AnimatedScale(
              scale: isSelected ? 1.15 : 0.95,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOutBack,
              child: Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: isSelected
                      ? const RadialGradient(
                          colors: [Color(0xFF38BDF8), Color(0xFF1D4ED8)],
                          center: Alignment.topLeft,
                          radius: 0.9,
                        )
                      : RadialGradient(
                          colors: [
                            const Color(0xFF334155).withValues(alpha: 0.8),
                            const Color(0xFF1E293B).withValues(alpha: 0.9),
                          ],
                        ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: const Color(0xFF38BDF8).withValues(alpha: 0.4),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Center(
                  child: Text(
                    item.emoji,
                    style: TextStyle(
                      fontSize: isSelected ? 20 : 17,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 5),

            // Category Label
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 200),
              style: TextStyle(
                fontSize: isSelected ? 11.5 : 10.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                letterSpacing: 0.1,
              ),
              child: Text(
                item.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SwiggyCategoryMeta {
  final ResidentHomeCategory category;
  final String label;
  final String emoji;
  final IconData icon;

  const _SwiggyCategoryMeta({
    required this.category,
    required this.label,
    required this.emoji,
    required this.icon,
  });
}
