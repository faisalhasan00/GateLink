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
        // Sub-filter tabs for Interior Vendors
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            children: [
              _buildTypeFilterChip(
                  'All Vendors (${sampleInteriorVendors.length})', null),
              const SizedBox(width: 6),
              _buildTypeFilterChip('🏢 Interior Studios', VendorType.studio),
              const SizedBox(width: 6),
              _buildTypeFilterChip(
                  '🎨 Freelancers', VendorType.freelancer),
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
}
