import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';
import 'hub_search_bar.dart';
import 'hub_category_pills.dart';
import 'interiors_furniture_section.dart';
import 'resident_bazaar_section.dart';
import 'domestic_staff_section.dart';
import 'home_services_section.dart';
import 'post_bazaar_ad_sheet.dart';
import 'hire_staff_dialog.dart';
import 'book_service_sheet.dart';

class HubDashboardView extends StatefulWidget {
  final VoidCallback onSwitchToGate;

  const HubDashboardView({
    super.key,
    required this.onSwitchToGate,
  });

  @override
  State<HubDashboardView> createState() => _HubDashboardViewState();
}

class _HubDashboardViewState extends State<HubDashboardView> {
  // Always default to Bazaar
  HubCategory _selectedCategory = HubCategory.bazaar;
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1. Search Bar micro-component
        HubSearchBar(
          controller: _searchController,
          hasQuery: _searchQuery.isNotEmpty,
          onChanged: (val) => setState(() => _searchQuery = val.toLowerCase()),
          onClear: () {
            _searchController.clear();
            setState(() => _searchQuery = '');
          },
        ),
        const SizedBox(height: AppSpacing.md),

        // 2. Segmented Button Bar (Bazaar by default)
        HubCategoryPills(
          selectedCategory: _selectedCategory,
          onSelectCategory: (cat) => setState(() => _selectedCategory = cat),
        ),
        const SizedBox(height: AppSpacing.lg),

        // 3. Render Active Selected Category Section
        if (_selectedCategory == HubCategory.bazaar) ...[
          ResidentBazaarSection(
            onPostAd: () => PostBazaarAdSheet.show(context),
            onChatWithResident: (flat) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Connecting to $flat via GateLink Chat...'),
                  backgroundColor: const Color(0xFF16A34A),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
          const SizedBox(height: AppSpacing.lg),
        ] else if (_selectedCategory == HubCategory.interiors) ...[
          InteriorsFurnitureSection(
            onSelectCategory: () =>
                setState(() => _selectedCategory = HubCategory.interiors),
            onBookConsultation: (_) {},
          ),
          const SizedBox(height: AppSpacing.lg),
        ] else if (_selectedCategory == HubCategory.maids) ...[
          DomesticStaffSection(
            onSelectCategory: () =>
                setState(() => _selectedCategory = HubCategory.maids),
            onHireStaff: (name, role) =>
                HireStaffDialog.show(context, staffName: name, role: role),
          ),
          const SizedBox(height: AppSpacing.lg),
        ] else if (_selectedCategory == HubCategory.services) ...[
          HomeServicesSection(
            onSelectCategory: () =>
                setState(() => _selectedCategory = HubCategory.services),
            onBookService: (serviceName, price) => BookServiceSheet.show(
                context,
                serviceName: serviceName,
                price: price),
          ),
          const SizedBox(height: AppSpacing.lg),
        ],

        // 4. Back to Society Gate
        Center(
          child: TextButton.icon(
            onPressed: widget.onSwitchToGate,
            icon: const Icon(Icons.arrow_back_rounded, size: 16),
            label: const Text(
              'Back to Society Gate & Security',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13,
                color: Color(0xFF1E3A8A),
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
      ],
    );
  }
}
