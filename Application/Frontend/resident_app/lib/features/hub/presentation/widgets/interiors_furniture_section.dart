import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../interiors/models/interior_vendor_model.dart';
import '../../interiors/models/sample_interior_vendors.dart';
import '../../interiors/presentation/screens/interior_vendor_shop_screen.dart';
import '../../interiors/presentation/widgets/interior_vendor_card.dart';

class InteriorsFurnitureSection extends StatefulWidget {
  final VoidCallback onSelectCategory;
  final void Function(String packageTitle) onBookConsultation;

  const InteriorsFurnitureSection({
    super.key,
    required this.onSelectCategory,
    required this.onBookConsultation,
  });

  @override
  State<InteriorsFurnitureSection> createState() =>
      _InteriorsFurnitureSectionState();
}

class _InteriorsFurnitureSectionState extends State<InteriorsFurnitureSection> {
  VendorType? _selectedTypeFilter; // null = all

  @override
  Widget build(BuildContext context) {
    final filteredVendors = _selectedTypeFilter == null
        ? sampleInteriorVendors
        : sampleInteriorVendors
            .where((v) => v.type == _selectedTypeFilter)
            .toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(),
        const SizedBox(height: AppSpacing.sm),

        // Hero Interior Banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF581C87), Color(0xFF7E22CE)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF7E22CE).withValues(alpha: 0.25),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'MULTI-VENDOR INTERIOR HUB • RESIDENT DISCOUNTS',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Explore Top Interior Studios & Freelancers',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Browse verified interior studios, freelance architects, and factory-direct modular makers. Inspect past flat transformations and get free site quotes.',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        // Sub-filter tabs for Interior Vendors
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            children: [
              _buildTypeFilterChip('All Vendors (${sampleInteriorVendors.length})', null),
              const SizedBox(width: 6),
              _buildTypeFilterChip('🏢 Interior Studios', VendorType.studio),
              const SizedBox(width: 6),
              _buildTypeFilterChip('🎨 Freelance Architects', VendorType.freelancer),
              const SizedBox(width: 6),
              _buildTypeFilterChip('🏭 Factory Direct', VendorType.contractor),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        // List of Vendor Cards
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: filteredVendors.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final vendor = filteredVendors[index];
            return InteriorVendorCard(
              vendor: vendor,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => InteriorVendorShopScreen(vendor: vendor),
                  ),
                );
              },
            );
          },
        ),
      ],
    );
  }

  Widget _buildTypeFilterChip(String label, VendorType? type) {
    final isSelected = _selectedTypeFilter == type;
    return GestureDetector(
      onTap: () => setState(() => _selectedTypeFilter = type),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF9333EA) : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? const Color(0xFF9333EA) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader() {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: const Color(0xFF9333EA).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Text(
            'MULTI-VENDOR',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w800,
              color: Color(0xFF9333EA),
              letterSpacing: 0.4,
            ),
          ),
        ),
        const SizedBox(width: 8),
        const Expanded(
          child: Text(
            'Interior Studios & Freelancers',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
        ),
      ],
    );
  }
}
