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

class TopCategoryBar extends StatelessWidget {
  final ResidentHomeCategory selectedCategory;
  final ValueChanged<ResidentHomeCategory> onCategoryChanged;

  const TopCategoryBar({
    super.key,
    required this.selectedCategory,
    required this.onCategoryChanged,
  });

  static const List<_ProductCategoryMeta> _categories = [
    _ProductCategoryMeta(
      category: ResidentHomeCategory.society,
      label: 'Society',
      type: _ProductVisualType.society,
      glowColor: Color(0xFF38BDF8), // Glowing Cyan Sky
    ),
    _ProductCategoryMeta(
      category: ResidentHomeCategory.maidsSalon,
      label: 'Maids',
      type: _ProductVisualType.maids,
      glowColor: Color(0xFFFBBF24), // Glowing Amber Sparkle
    ),
    _ProductCategoryMeta(
      category: ResidentHomeCategory.services,
      label: 'Services',
      type: _ProductVisualType.services,
      glowColor: Color(0xFF60A5FA), // Electric Blue
    ),
    _ProductCategoryMeta(
      category: ResidentHomeCategory.interiors,
      label: 'Interiors',
      type: _ProductVisualType.interiors,
      glowColor: Color(0xFFA78BFA), // Lavender Studio
    ),
    _ProductCategoryMeta(
      category: ResidentHomeCategory.bazaar,
      label: 'Bazaar',
      type: _ProductVisualType.bazaar,
      glowColor: Color(0xFF34D399), // Emerald Marketplace
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 90,
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF070D1F), // Swiggy Deep Midnight Navy Base
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF1E293B).withValues(alpha: 0.8),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.45),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: _categories.map((item) {
          final isSelected = item.category == selectedCategory;
          return Expanded(
            child: _SwiggyProductTabItem(
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

class _SwiggyProductTabItem extends StatelessWidget {
  final _ProductCategoryMeta item;
  final bool isSelected;
  final VoidCallback onTap;

  const _SwiggyProductTabItem({
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
                    Color(0xFF1E3A8A), // GateLink Signature Primary Navy
                    Color(0xFF0B142B), // Deep smooth fade
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                  bottom: Radius.circular(12),
                ),
                border: Border(
                  top: BorderSide(
                    color: item.glowColor, // Glowing Curved Arch Highlight
                    width: 2.4,
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
                    color: item.glowColor.withValues(alpha: 0.32),
                    blurRadius: 14,
                    offset: const Offset(0, -3),
                  ),
                ],
              )
            : BoxDecoration(
                color: const Color(0xFF121B33).withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.03),
                  width: 1,
                ),
              ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 3D Product-Style Illustration
            AnimatedScale(
              scale: isSelected ? 1.15 : 0.95,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOutBack,
              child: AnimatedOpacity(
                opacity: isSelected ? 1.0 : 0.72,
                duration: const Duration(milliseconds: 200),
                child: SizedBox(
                  width: 42,
                  height: 40,
                  child: _buildProductArtwork(item.type, isSelected),
                ),
              ),
            ),
            const SizedBox(height: 3),

            // Manrope Clean Typography
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

  Widget _buildProductArtwork(_ProductVisualType type, bool isSelected) {
    switch (type) {
      case _ProductVisualType.society:
        return const _Society3DArtwork();
      case _ProductVisualType.maids:
        return const _Maids3DArtwork();
      case _ProductVisualType.services:
        return const _Services3DArtwork();
      case _ProductVisualType.interiors:
        return const _Interiors3DArtwork();
      case _ProductVisualType.bazaar:
        return const _Bazaar3DArtwork();
    }
  }
}

enum _ProductVisualType {
  society,
  maids,
  services,
  interiors,
  bazaar,
}

class _ProductCategoryMeta {
  final ResidentHomeCategory category;
  final String label;
  final _ProductVisualType type;
  final Color glowColor;

  const _ProductCategoryMeta({
    required this.category,
    required this.label,
    required this.type,
    required this.glowColor,
  });
}

// ==========================================
// 3D PRODUCT-STYLE ARTWORK WIDGETS
// ==========================================

/// 1. Society: 3D Smart Gatehouse & Sky Towers with Security Shield
class _Society3DArtwork extends StatelessWidget {
  const _Society3DArtwork();

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Background Tower
        Positioned(
          left: 6,
          top: 4,
          child: Container(
            width: 14,
            height: 28,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0EA5E9), Color(0xFF1E3A8A)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.circular(4),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0EA5E9).withValues(alpha: 0.3),
                  blurRadius: 4,
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                3,
                (_) => Container(
                  width: 8,
                  height: 3,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
              ),
            ),
          ),
        ),

        // Foreground Main Tower
        Positioned(
          right: 8,
          bottom: 2,
          child: Container(
            width: 16,
            height: 32,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF38BDF8), Color(0xFF1D4ED8)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white.withValues(alpha: 0.2), width: 0.8),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                4,
                (_) => Container(
                  width: 10,
                  height: 3,
                  decoration: BoxDecoration(
                    color: const Color(0xFFBAE6FD),
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
              ),
            ),
          ),
        ),

        // Smart Security Shield Badge
        Positioned(
          bottom: 0,
          left: 8,
          child: Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: const Color(0xFFF59E0B),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFF59E0B).withValues(alpha: 0.5),
                  blurRadius: 6,
                ),
              ],
            ),
            child: const Icon(Icons.shield_rounded, size: 10, color: Colors.white),
          ),
        ),
      ],
    );
  }
}

/// 2. Maids: 3D Housekeeping Spray/Caddy + Sparkling Clean Stars
class _Maids3DArtwork extends StatelessWidget {
  const _Maids3DArtwork();

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // 3D Cleaning Spray & Sponge
        Container(
          width: 24,
          height: 30,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF06B6D4), Color(0xFF0891B2)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(6),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF06B6D4).withValues(alpha: 0.4),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                width: 12,
                height: 6,
                decoration: const BoxDecoration(
                  color: Color(0xFFFDE047),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(3)),
                ),
              ),
              const Spacer(),
              const Icon(Icons.auto_awesome, size: 12, color: Colors.white),
              const SizedBox(height: 4),
            ],
          ),
        ),

        // Yellow Sponge accent
        Positioned(
          bottom: 2,
          right: 4,
          child: Container(
            width: 14,
            height: 10,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFBBF24), Color(0xFFD97706)],
              ),
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 0.8),
            ),
          ),
        ),

        // Sparkle Star top right
        Positioned(
          top: 0,
          right: 2,
          child: Icon(Icons.star_rounded, size: 14, color: const Color(0xFFFDE047)),
        ),
      ],
    );
  }
}

/// 3. Services: 3D Repair Tool Box + Electric Lightning Bolt
class _Services3DArtwork extends StatelessWidget {
  const _Services3DArtwork();

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // 3D Tool Box Base
        Container(
          width: 30,
          height: 22,
          margin: const EdgeInsets.only(top: 8),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFEA580C), Color(0xFFC2410C)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(5),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFEA580C).withValues(alpha: 0.4),
                blurRadius: 6,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Center(
            child: Container(
              width: 26,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFF9A3412),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
        ),

        // Metallic Handle
        Positioned(
          top: 3,
          child: Container(
            width: 14,
            height: 8,
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFFCBD5E1), width: 2),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
            ),
          ),
        ),

        // Chrome Wrench protruding
        Positioned(
          top: 0,
          right: 4,
          child: Transform.rotate(
            angle: 0.4,
            child: const Icon(Icons.build_rounded, size: 16, color: Color(0xFFF1F5F9)),
          ),
        ),

        // Lightning Sparkle
        Positioned(
          bottom: 1,
          left: 2,
          child: const Icon(Icons.bolt_rounded, size: 14, color: Color(0xFFFBBF24)),
        ),
      ],
    );
  }
}

/// 4. Interiors: 3D Luxury Lounge Armchair & Floor Lamp
class _Interiors3DArtwork extends StatelessWidget {
  const _Interiors3DArtwork();

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // 3D Lounge Sofa / Armchair
        Container(
          width: 28,
          height: 24,
          margin: const EdgeInsets.only(top: 8, right: 6),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: Colors.white.withValues(alpha: 0.2), width: 0.8),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF8B5CF6).withValues(alpha: 0.4),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Container(
              width: 16,
              height: 10,
              decoration: BoxDecoration(
                color: const Color(0xFF7C3AED),
                borderRadius: BorderRadius.circular(3),
              ),
            ),
          ),
        ),

        // Modern Floor Lamp with Warm Shade
        Positioned(
          top: 2,
          right: 2,
          child: Column(
            children: [
              Container(
                width: 10,
                height: 7,
                decoration: const BoxDecoration(
                  color: Color(0xFFFBBF24),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xFFFDE047),
                      blurRadius: 6,
                    ),
                  ],
                ),
              ),
              Container(
                width: 1.5,
                height: 22,
                color: const Color(0xFF94A3B8),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// 5. Bazaar: 3D Shopping Tote Bag with % Discount Price Tag
class _Bazaar3DArtwork extends StatelessWidget {
  const _Bazaar3DArtwork();

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // 3D Shopping Bag Body
        Container(
          width: 24,
          height: 26,
          margin: const EdgeInsets.only(top: 6),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF10B981), Color(0xFF059669)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(5),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF10B981).withValues(alpha: 0.4),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Center(
            child: Icon(Icons.storefront_rounded, size: 12, color: Colors.white),
          ),
        ),

        // Bag Handles
        Positioned(
          top: 0,
          child: Container(
            width: 12,
            height: 8,
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFFD1FAE5), width: 1.5),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
            ),
          ),
        ),

        // Golden % Discount Tag
        Positioned(
          bottom: 2,
          right: 2,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 1),
            decoration: BoxDecoration(
              color: const Color(0xFFEF4444),
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: Colors.white, width: 0.8),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFEF4444).withValues(alpha: 0.5),
                  blurRadius: 4,
                ),
              ],
            ),
            child: const Text(
              '%',
              style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }
}
