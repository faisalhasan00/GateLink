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
      accentColor: Color(0xFF5B8CFF), // Blue
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.maidsSalon,
      label: 'Maids',
      icon: Icons.people_outline_rounded,
      accentColor: Color(0xFFF2B544), // Amber
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.services,
      label: 'Services',
      icon: Icons.design_services_outlined,
      accentColor: Color(0xFFFF6F6F), // Coral/Red
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.interiors,
      label: 'Interiors',
      icon: Icons.weekend_outlined,
      accentColor: Color(0xFFB98BFF), // Purple
      hasBadge: false,
    ),
    _TabConfig(
      category: ResidentHomeCategory.bazaar,
      label: 'Bazaar',
      icon: Icons.shopping_bag_outlined,
      accentColor: Color(0xFF3ECF9A), // Green
      hasBadge: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      height: 58,
      decoration: BoxDecoration(
        color: const Color(0xFF0D1322).withValues(alpha: 0.94),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.08),
          width: 0.8,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Padding(
            padding: const EdgeInsets.all(6),
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
                    ? tab.accentColor.withValues(alpha: 0.14)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
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
                        color: isActive ? tab.accentColor : const Color(0xFF5B6472),
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
                              fontWeight: FontWeight.w600,
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
                              color: tab.accentColor.withValues(alpha: 0.6),
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
  final bool hasBadge;

  const _TabConfig({
    required this.category,
    required this.label,
    required this.icon,
    required this.accentColor,
    required this.hasBadge,
  });
}
