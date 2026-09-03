import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../models/interior_vendor_model.dart';
import '../widgets/vendor_shop_header.dart';
import '../widgets/vendor_projects_tab.dart';
import '../widgets/vendor_packages_tab.dart';
import '../widgets/vendor_reviews_tab.dart';
import '../widgets/vendor_booking_sheet.dart';
import '../widgets/vendor_bottom_bar.dart';

class InteriorVendorShopScreen extends StatefulWidget {
  final InteriorVendor vendor;

  const InteriorVendorShopScreen({
    super.key,
    required this.vendor,
  });

  @override
  State<InteriorVendorShopScreen> createState() =>
      _InteriorVendorShopScreenState();
}

class _InteriorVendorShopScreenState extends State<InteriorVendorShopScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final v = widget.vendor;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          v.name,
          style: const TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 16,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: Color(0xFF64748B)),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Sharing ${v.name} profile with neighbors...'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Header Profile Micro-Component
          VendorShopHeader(vendor: v),

          // 2. Tab Bar
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              labelColor: const Color(0xFF9333EA),
              unselectedLabelColor: const Color(0xFF64748B),
              indicatorColor: const Color(0xFF9333EA),
              indicatorWeight: 3,
              labelStyle:
                  const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
              unselectedLabelStyle:
                  const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              tabs: [
                Tab(text: 'Projects (${v.projects.length})'),
                Tab(text: 'Packages (${v.packages.length})'),
                Tab(text: 'Reviews (${v.reviews.length})'),
              ],
            ),
          ),

          // 3. Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                VendorProjectsTab(projects: v.projects),
                VendorPackagesTab(
                  packages: v.packages,
                  onGetQuote: (pkgTitle) => VendorBookingSheet.show(
                    context,
                    vendor: v,
                    preselectedPackage: pkgTitle,
                  ),
                ),
                VendorReviewsTab(reviews: v.reviews),
              ],
            ),
          ),

          // 4. Sticky Bottom Action Bar Micro-Component
          VendorBottomBar(
            vendor: v,
            onBookVisit: () => VendorBookingSheet.show(context, vendor: v),
          ),
        ],
      ),
    );
  }
}
