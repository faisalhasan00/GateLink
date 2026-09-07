import 'package:flutter/material.dart';
import 'interiors_hero_banner.dart';
import 'interior_cost_estimator.dart';
import 'interior_packages_grid.dart';
import 'interior_portfolio_view.dart';
import 'interior_testimonials.dart';

class InteriorsDashboardView extends StatelessWidget {
  const InteriorsDashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        // 1. In-House Studio Hero Banner (Warranty, 45-day finish, society discount)
        InteriorsHeroBanner(),
        SizedBox(height: 16),

        // 2. Interactive Flat Cost Estimator
        InteriorCostEstimator(),
        SizedBox(height: 20),

        // 3. Pre-Engineered Curated Turnkey Packages
        InteriorPackagesGrid(),
        SizedBox(height: 20),

        // 4. Real Completed Project Lookbook
        InteriorPortfolioView(),
        SizedBox(height: 20),

        // 5. Verified Resident Testimonials
        InteriorTestimonials(),
        SizedBox(height: 24),
      ],
    );
  }
}
