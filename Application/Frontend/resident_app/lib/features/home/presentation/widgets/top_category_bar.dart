import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_colors.dart';

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

  static const List<_CategoryBrandMeta> _categories = [
    _CategoryBrandMeta(
      category: ResidentHomeCategory.society,
      label: 'Society',
      icon: Icons.apartment_rounded,
      activeGradient: [Color(0xFF0EA5E9), Color(0xFF1E3A8A)], // Sky to Navy
      glowColor: Color(0xFF38BDF8),
    ),
    _CategoryBrandMeta(
      category: ResidentHomeCategory.maidsSalon,
      label: 'Maids',
      icon: Icons.auto_awesome_rounded,
      activeGradient: [Color(0xFFF59E0B), Color(0xFFD97706)], // Amber to Warm Orange
      glowColor: Color(0xFFFBBF24),
    ),
    _CategoryBrandMeta(
      category: ResidentHomeCategory.services,
      label: 'Services',
      icon: Icons.handyman_rounded,
      activeGradient: [Color(0xFF0284C7), Color(0xFF1E3A8A)], // Sky to Deep Navy
      glowColor: Color(0xFF0EA5E9),
    ),
    _CategoryBrandMeta(
      category: ResidentHomeCategory.interiors,
      label: 'Interiors',
      icon: Icons.chair_rounded,
      activeGradient: [Color(0xFF8B5CF6), Color(0xFF6D28D9)], // Purple to Indigo
      glowColor: Color(0xFFA78BFA),
    ),
    _CategoryBrandMeta(
      category: ResidentHomeCategory.bazaar,
      label: 'Bazaar',
      icon: Icons.storefront_rounded,
      activeGradient: [Color(0xFF10B981), Color(0xFF059669)], // Emerald
      glowColor: Color(0xFF34D399),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 84,
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A), // GateLink Deep Navy Slate base
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: const Color(0xFF1E293B),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.4),
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
            child: _SwiggyBrandTabItem(
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

class _SwiggyBrandTabItem extends StatelessWidget {
  final _CategoryBrandMeta item;
  final bool isSelected;
  final VoidCallback onTap;

  const _SwiggyBrandTabItem({
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
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeInOutCubic,
        margin: const EdgeInsets.symmetric(horizontal: 2),
        decoration: isSelected
            ? BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF1E3A8A), // GateLink Primary Navy
                    Color(0xFF172554), // Deep Navy
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(14),
                  bottom: Radius.circular(10),
                ),
                border: Border(
                  top: BorderSide(
                    color: item.glowColor, // Glowing Category Accent Top Border
                    width: 2.2,
                  ),
                  left: BorderSide(
                    color: Colors.white.withValues(alpha: 0.12),
                    width: 1,
                  ),
                  right: BorderSide(
                    color: Colors.white.withValues(alpha: 0.12),
                    width: 1,
                  ),
                  bottom: BorderSide.none,
                ),
                boxShadow: [
                  BoxShadow(
                    color: item.glowColor.withValues(alpha: 0.28),
                    blurRadius: 12,
                    offset: const Offset(0, -2),
                  ),
                ],
              )
            : BoxDecoration(
                color: const Color(0xFF1E293B).withValues(alpha: 0.45),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.03),
                  width: 1,
                ),
              ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Crisp Vector Icon Capsule
            AnimatedScale(
              scale: isSelected ? 1.12 : 0.94,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOutBack,
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: isSelected
                      ? RadialGradient(
                          colors: item.activeGradient,
                          center: Alignment.topLeft,
                          radius: 0.9,
                        )
                      : RadialGradient(
                          colors: [
                            const Color(0xFF334155).withValues(alpha: 0.7),
                            const Color(0xFF1E293B).withValues(alpha: 0.9),
                          ],
                        ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: item.glowColor.withValues(alpha: 0.35),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Center(
                  child: Icon(
                    item.icon,
                    size: isSelected ? 19 : 17,
                    color: isSelected ? Colors.white : const Color(0xFFCBD5E1),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 4.5),

            // GateLink Manrope Brand Typography
            Text(
              item.label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.manrope(
                fontSize: isSelected ? 11.5 : 10.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                letterSpacing: 0.1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryBrandMeta {
  final ResidentHomeCategory category;
  final String label;
  final IconData icon;
  final List<Color> activeGradient;
  final Color glowColor;

  const _CategoryBrandMeta({
    required this.category,
    required this.label,
    required this.icon,
    required this.activeGradient,
    required this.glowColor,
  });
}
