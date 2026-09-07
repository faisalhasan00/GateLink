import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

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
  late final ScrollController _scrollController;

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
      icon: Icons.auto_awesome_rounded,
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
  void initState() {
    super.initState();
    _scrollController = ScrollController();
  }

  @override
  void didUpdateWidget(TopCategoryBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedCategory != widget.selectedCategory) {
      _scrollToSelectedCategory();
    }
  }

  void _scrollToSelectedCategory() {
    final index = _categories.indexWhere((c) => c.category == widget.selectedCategory);
    if (index >= 0 && _scrollController.hasClients) {
      const approxItemWidth = 110.0;
      final targetOffset = (index * approxItemWidth) - 40;
      _scrollController.animateTo(
        targetOffset.clamp(0.0, _scrollController.position.maxScrollExtent),
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      margin: const EdgeInsets.only(bottom: 6),
      child: ScrollConfiguration(
        behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
        child: ListView.separated(
          controller: _scrollController,
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 2),
          itemCount: _categories.length,
          separatorBuilder: (_, __) => const SizedBox(width: 8),
          itemBuilder: (context, index) {
            final item = _categories[index];
            final isSelected = item.category == widget.selectedCategory;

            return GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                widget.onCategoryChanged(item.category);
              },
              child: AnimatedScale(
                scale: isSelected ? 1.02 : 1.0,
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOutCubic,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 220),
                  curve: Curves.easeInOutCubic,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFE2E8F0),
                      width: isSelected ? 1.5 : 1.0,
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: const Color(0xFF1E3A8A).withValues(alpha: 0.22),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ]
                        : [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
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
                        size: 16,
                        color: isSelected ? Colors.white : const Color(0xFF64748B),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        item.label,
                        style: TextStyle(
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                          color: isSelected ? Colors.white : const Color(0xFF1E293B),
                          fontSize: 12.5,
                        ),
                      ),
                      if (item.badge != null) ...[
                        const SizedBox(width: 5),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? Colors.white.withValues(alpha: 0.25)
                                : const Color(0xFFE0F2FE),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            item.badge!,
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? Colors.white : const Color(0xFF0369A1),
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
