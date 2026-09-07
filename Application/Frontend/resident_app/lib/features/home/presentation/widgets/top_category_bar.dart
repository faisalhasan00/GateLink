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

  static const List<_CategoryMeta> _categories = [
    _CategoryMeta(
      category: ResidentHomeCategory.society,
      label: 'Society',
      icon: Icons.apartment_rounded,
      badge: null,
    ),
    _CategoryMeta(
      category: ResidentHomeCategory.maidsSalon,
      label: 'Maids & Salon',
      icon: Icons.face_retouching_natural_rounded,
      badge: 'Popular',
    ),
    _CategoryMeta(
      category: ResidentHomeCategory.services,
      label: 'Services',
      icon: Icons.handyman_rounded,
      badge: null,
    ),
    _CategoryMeta(
      category: ResidentHomeCategory.interiors,
      label: 'Interiors',
      icon: Icons.weekend_rounded,
      badge: 'Studio',
    ),
    _CategoryMeta(
      category: ResidentHomeCategory.bazaar,
      label: 'Bazaar',
      icon: Icons.storefront_rounded,
      badge: 'Market',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      margin: const EdgeInsets.only(bottom: 8),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 4),
        itemCount: _categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final item = _categories[index];
          final isSelected = item.category == selectedCategory;

          return Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                HapticFeedback.selectionClick();
                onCategoryChanged(item.category);
              },
              borderRadius: BorderRadius.circular(999),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOutCubic,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFF1E3A8A)
                        : const Color(0xFFE2E8F0),
                    width: isSelected ? 1.5 : 1,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: const Color(0xFF1E3A8A).withOpacity(0.24),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ]
                      : [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      item.icon,
                      size: 18,
                      color: isSelected
                          ? Colors.white
                          : const Color(0xFF64748B),
                    ),
                    const SizedBox(width: 7),
                    Text(
                      item.label,
                      style: TextStyle(
                        fontWeight:
                            isSelected ? FontWeight.w800 : FontWeight.w600,
                        color: isSelected
                            ? Colors.white
                            : const Color(0xFF1E293B),
                        fontSize: 13,
                      ),
                    ),
                    if (item.badge != null) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? Colors.white.withOpacity(0.22)
                              : const Color(0xFFE0F2FE),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          item.badge!,
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: isSelected
                                ? Colors.white
                                : const Color(0xFF0369A1),
                            letterSpacing: 0.3,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _CategoryMeta {
  final ResidentHomeCategory category;
  final String label;
  final IconData icon;
  final String? badge;

  const _CategoryMeta({
    required this.category,
    required this.label,
    required this.icon,
    this.badge,
  });
}
