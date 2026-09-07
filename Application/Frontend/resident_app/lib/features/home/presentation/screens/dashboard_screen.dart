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
            SliverPadding(
              padding: const EdgeInsets.all(AppSpacing.pagePadding),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Sticky / Top 5-Category Navigation Bar: Society, Maids & Salon, Services, Interiors, Bazaar
                  TopCategoryBar(
                    selectedCategory: selectedCategory,
                    onCategoryChanged: (cat) {
                      ref.read(residentHomeCategoryProvider.notifier).state = cat;
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Dynamic Section Rendering based on Selected Category
                  if (selectedCategory == ResidentHomeCategory.society) ...[
                    const SocietyDashboardContent(),
                  ] else if (selectedCategory == ResidentHomeCategory.maidsSalon) ...[
                    const MaidsSalonDashboardView(),
                  ] else if (selectedCategory == ResidentHomeCategory.services) ...[
                    const ServicesDashboardView(),
                  ] else if (selectedCategory == ResidentHomeCategory.interiors) ...[
                    const InteriorsDashboardView(),
                  ] else if (selectedCategory == ResidentHomeCategory.bazaar) ...[
                    const BazaarDashboardView(),
                  ],
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
