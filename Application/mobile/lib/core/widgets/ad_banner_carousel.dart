import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../features/advertisement/models/ad_model.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// A swipeable advertisement banner carousel widget.
/// Designed to match the app's existing card language —
/// same structure as _MaintenanceDueBanner: full-width gradient
/// card with icon + text column + white CTA button in a Row.
class AdBannerCarousel extends StatefulWidget {
  final List<AdModel> ads;

  const AdBannerCarousel({super.key, required this.ads});

  @override
  State<AdBannerCarousel> createState() => _AdBannerCarouselState();
}

class _AdBannerCarouselState extends State<AdBannerCarousel> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _launchUrl(String? url) async {
    if (url == null) return;
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.ads.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        SizedBox(
          // Same intrinsic height as the maintenance banner
          height: 96,
          child: PageView.builder(
            controller: _pageController,
            itemCount: widget.ads.length,
            onPageChanged: (index) => setState(() => _currentPage = index),
            itemBuilder: (context, index) {
              final ad = widget.ads[index];
              return _AdCard(
                ad: ad,
                onCtaTap: () => _launchUrl(ad.ctaUrl),
              );
            },
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        _DotIndicator(
          count: widget.ads.length,
          currentIndex: _currentPage,
        ),
      ],
    );
  }
}

/// Individual ad card — mirrors the exact layout of _MaintenanceDueBanner:
/// gradient container → Row [ Icon | Column(label, title, subtitle) | Button ]
class _AdCard extends StatelessWidget {
  final AdModel ad;
  final VoidCallback onCtaTap;

  const _AdCard({required this.ad, required this.onCtaTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [ad.gradientStart, ad.gradientEnd],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
      child: Row(
        children: [
          // Icon — same size as maintenance banner icon (36)
          Icon(ad.icon, color: Colors.white, size: 36),
          const SizedBox(width: AppSpacing.md),

          // Text column — mirrors the maintenance banner text column
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Label row with subtle AD badge
                Row(
                  children: [
                    Text(
                      ad.isAdvertiseHerePlaceholder
                          ? '💼 PROMOTE YOUR BUSINESS'
                          : 'SPONSORED',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                // Business name — big, like the ₹ amount in maintenance
                Text(
                  ad.businessName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                // Tagline — like the "Due by" subtitle
                Text(
                  ad.tagline,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),

          const SizedBox(width: AppSpacing.sm),

          // CTA Button — same style as the "Pay Now" button
          ElevatedButton(
            onPressed: onCtaTap,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: ad.gradientStart,
              minimumSize: const Size(72, 36),
              maximumSize: const Size(84, 36),
              elevation: 0,
              textStyle: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
            ),
            child: Text(
              ad.ctaText,
              textAlign: TextAlign.center,
              maxLines: 1,
            ),
          ),
        ],
      ),
    );
  }
}

/// Pill-shaped dot indicator — same design tokens as the rest of the app.
class _DotIndicator extends StatelessWidget {
  final int count;
  final int currentIndex;

  const _DotIndicator({required this.count, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (index) {
        final isActive = index == currentIndex;
        return AnimatedContainer(
          duration: AppDuration.normal,
          margin: const EdgeInsets.symmetric(horizontal: 3),
          width: isActive ? 18 : 6,
          height: 6,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primary : AppColors.gray300,
            borderRadius: BorderRadius.circular(AppRadius.full),
          ),
        );
      }),
    );
  }
}
