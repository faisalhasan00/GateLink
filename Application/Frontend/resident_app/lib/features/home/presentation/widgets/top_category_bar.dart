import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

enum ResidentHomeCategory {
  society,
  maidsSalon,
  services,
  interiors,
  bazaar,
}

class TopCategoryBar extends StatefulWidget {
  final ResidentHomeCategory selectedCategory;
  final ValueChanged<ResidentHomeCategory> onCategoryChanged;

  const TopCategoryBar({
    super.key,
    required this.selectedCategory,
    required this.onCategoryChanged,
  });

  @override
  State<TopCategoryBar> createState() => _TopCategoryBarState();
}

class _TopCategoryBarState extends State<TopCategoryBar> {
  ResidentHomeCategory? _pressedCategory;

  static const List<_TabConfig> _tabs = [
    _TabConfig(
      category: ResidentHomeCategory.society,
      label: 'Society',
      icon: Icons.domain_rounded,
      accentColor: Color(0xFF1E3A8A), // GateLink Primary Navy
      tintBgColor: Color(0xFFE0F2FE), // Sky-100 Surface
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.maidsSalon,
      label: 'Maids',
      icon: Icons.people_outline_rounded,
      accentColor: Color(0xFFD97706), // GateLink Warm Amber
      tintBgColor: Color(0xFFFEF3C7), // Amber-100 Surface
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.services,
      label: 'Services',
      icon: Icons.design_services_outlined,
      accentColor: Color(0xFFE11D48), // Coral / Red
      tintBgColor: Color(0xFFFFE4E6), // Rose-100 Surface
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.interiors,
      label: 'Interiors',
      icon: Icons.weekend_outlined,
      accentColor: Color(0xFF7E22CE), // Purple / Violet
      tintBgColor: Color(0xFFF3E8FF), // Purple-100 Surface
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.bazaar,
      label: 'Bazaar',
      icon: Icons.shopping_bag_outlined,
      accentColor: Color(0xFF059669), // Emerald Green
      tintBgColor: Color(0xFFDCFCE7), // Emerald-100 Surface
      hasBadge: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      height: 58,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFFE2E8F0),
          width: 1.0,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.07),
            blurRadius: 18,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: const Color(0xFF0EA5E9).withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Padding(
            padding: const EdgeInsets.all(5),
            child: Row(
              children: _tabs.map((tab) {
                final isActive = tab.category == widget.selectedCategory;
                final isPressed = tab.category == _pressedCategory;

                return _ExpandingTabItem(
                  tab: tab,
                  isActive: isActive,
                  isPressed: isPressed,
                  onTapDown: () => setState(() => _pressedCategory = tab.category),
                  onTapUp: () => setState(() => _pressedCategory = null),
                  onTapCancel: () => setState(() => _pressedCategory = null),
                  onTap: () {
                    HapticFeedback.lightImpact();
                    widget.onCategoryChanged(tab.category);
                  },
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

class _ExpandingTabItem extends StatelessWidget {
  final _TabConfig tab;
  final bool isActive;
  final bool isPressed;
  final VoidCallback onTapDown;
  final VoidCallback onTapUp;
  final VoidCallback onTapCancel;
  final VoidCallback onTap;

  const _ExpandingTabItem({
    required this.tab,
    required this.isActive,
    required this.isPressed,
    required this.onTapDown,
    required this.onTapUp,
    required this.onTapCancel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: isActive ? 3 : 1,
      child: Semantics(
        label: tab.label,
        selected: isActive,
        button: true,
        child: GestureDetector(
          onTapDown: (_) => onTapDown(),
          onTapUp: (_) => onTapUp(),
          onTapCancel: () => onTapCancel(),
          onTap: onTap,
          behavior: HitTestBehavior.opaque,
          child: AnimatedScale(
            scale: isPressed ? 0.94 : 1.0,
            duration: const Duration(milliseconds: 100),
            curve: Curves.easeOutCubic,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 280),
              curve: Curves.easeOutCubic,
              height: 46,
              padding: EdgeInsets.symmetric(
                horizontal: isActive ? 12 : 0,
              ),
              decoration: BoxDecoration(
                color: isActive
                    ? tab.tintBgColor
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
                border: isActive
                    ? Border.all(
                        color: tab.accentColor.withValues(alpha: 0.18),
                        width: 1.0,
                      )
                    : null,
              ),
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      // Outline Icon
                      Icon(
                        tab.icon,
                        size: 21,
                        color: isActive ? tab.accentColor : const Color(0xFF64748B),
                      ),

                      // Animated Expanding Label
                      if (isActive) ...[
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            tab.label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: tab.accentColor,
                              letterSpacing: -0.1,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),

                  // Small 6px Badge Dot for Inactive Bazaar
                  if (tab.hasBadge && !isActive)
                    Positioned(
                    top: 6,
                    right: 10,
                    child: Container(
                      width: 6.5,
                      height: 6.5,
                      decoration: BoxDecoration(
                        color: tab.accentColor,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: tab.accentColor.withValues(alpha: 0.5),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TabConfig {
  final ResidentHomeCategory category;
  final String label;
  final IconData icon;
  final Color accentColor;
  final Color tintBgColor;
  final bool hasBadge;

  const _TabConfig({
    required this.category,
    required this.label,
    required this.icon,
    required this.accentColor,
    required this.tintBgColor,
    required this.hasBadge,
  });
}
