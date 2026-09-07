import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/dashboard_app_bar.dart';
import '../widgets/top_category_bar.dart';
import '../widgets/society_dashboard_content.dart';
import '../../../hub/maids_salon/presentation/widgets/maids_salon_dashboard_view.dart';
import '../../../hub/services/presentation/widgets/services_dashboard_view.dart';
import '../../../hub/interiors/presentation/widgets/interiors_dashboard_view.dart';
import '../../../hub/bazaar/presentation/widgets/bazaar_dashboard_view.dart';

final residentHomeCategoryProvider =
    StateProvider<ResidentHomeCategory>((ref) => ResidentHomeCategory.society);

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  Future<void> _handleRefresh(WidgetRef ref) async {
    HapticFeedback.lightImpact();
    ref.invalidate(userProfileProvider);
    ref.invalidate(maintenanceBillsStreamProvider);
    ref.invalidate(pendingVisitorsForFlatStreamProvider);
    ref.invalidate(noticesStreamProvider);
    ref.invalidate(myComplaintsStreamProvider);
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(residentHomeCategoryProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        onRefresh: () => _handleRefresh(ref),
        color: const Color(0xFF1E3A8A),
        backgroundColor: Colors.white,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(
            parent: BouncingScrollPhysics(),
          ),
          slivers: [
            const DashboardAppBar(),

            // Swiggy-Style Sticky Top Category Header
            SliverPersistentHeader(
              pinned: true,
              delegate: _StickyCategoryHeaderDelegate(
                child: Container(
                  color: AppColors.background,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.pagePadding,
                    vertical: 8,
                  ),
                  child: TopCategoryBar(
                    selectedCategory: selectedCategory,
                    onCategoryChanged: (cat) {
                      ref.read(residentHomeCategoryProvider.notifier).state = cat;
                    },
                  ),
                ),
              ),
            ),

            // Category Content with Swiggy-Style Smooth Transition
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding,
                4,
                AppSpacing.pagePadding,
                AppSpacing.pagePadding,
              ),
              sliver: SliverToBoxAdapter(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  switchInCurve: Curves.easeOutCubic,
                  switchOutCurve: Curves.easeInCubic,
                  transitionBuilder: (child, animation) {
                    return FadeTransition(
                      opacity: animation,
                      child: SlideTransition(
                        position: Tween<Offset>(
                          begin: const Offset(0.0, 0.02),
                          end: Offset.zero,
                        ).animate(animation),
                        child: child,
                      ),
                    );
                  },
                  child: KeyedSubtree(
                    key: ValueKey<ResidentHomeCategory>(selectedCategory),
                    child: _buildCategoryView(selectedCategory),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryView(ResidentHomeCategory category) {
    switch (category) {
      case ResidentHomeCategory.society:
        return const SocietyDashboardContent();
      case ResidentHomeCategory.maidsSalon:
        return const MaidsSalonDashboardView();
      case ResidentHomeCategory.services:
        return const ServicesDashboardView();
      case ResidentHomeCategory.interiors:
        return const InteriorsDashboardView();
      case ResidentHomeCategory.bazaar:
        return const BazaarDashboardView();
    }
  }
}

class _StickyCategoryHeaderDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;

  _StickyCategoryHeaderDelegate({required this.child});

  @override
  double get minExtent => 62.0;

  @override
  double get maxExtent => 62.0;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return child;
  }

  @override
  bool shouldRebuild(covariant _StickyCategoryHeaderDelegate oldDelegate) {
    return true;
  }
}
