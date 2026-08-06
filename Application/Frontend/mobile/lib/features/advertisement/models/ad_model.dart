import 'package:flutter/material.dart';

/// Represents a single advertisement poster in the carousel.
class AdModel {
  final String id;
  final String businessName;
  final String tagline;
  final String ctaText;
  final String? ctaUrl; // External URL: website, WhatsApp wa.me link, tel:, etc.
  final Color gradientStart;
  final Color gradientEnd;
  final IconData icon;
  final bool isAdvertiseHerePlaceholder;

  const AdModel({
    required this.id,
    required this.businessName,
    required this.tagline,
    required this.ctaText,
    this.ctaUrl,
    required this.gradientStart,
    required this.gradientEnd,
    required this.icon,
    this.isAdvertiseHerePlaceholder = false,
  });
}

/// Mock/static ad data for initial version.
/// Replace with API/Firebase data when backend is ready.
class AdRepository {
  static List<AdModel> getMockAds() {
    return [
      const AdModel(
        id: 'ad_001',
        businessName: 'Fresh Mart Grocery',
        tagline: '10% off on all groceries for society members',
        ctaText: 'Order Now',
        ctaUrl: 'https://wa.me/919876543210',
        gradientStart: Color(0xFF16A34A),
        gradientEnd: Color(0xFF4ADE80),
        icon: Icons.shopping_basket_rounded,
      ),
      const AdModel(
        id: 'ad_002',
        businessName: 'QuickFix Plumbing & Electrical',
        tagline: 'Same-day repair service, trusted by 500+ residents',
        ctaText: 'Call Now',
        ctaUrl: 'tel:+919123456789',
        gradientStart: Color(0xFF1D4ED8),
        gradientEnd: Color(0xFF60A5FA),
        icon: Icons.build_rounded,
      ),
      const AdModel(
        id: 'ad_003',
        businessName: 'Café Breeze',
        tagline: 'Fresh coffee & snacks delivered to your doorstep',
        ctaText: 'View Menu',
        ctaUrl: 'https://example.com/cafebreeze',
        gradientStart: Color(0xFFEA580C),
        gradientEnd: Color(0xFFFBBF24),
        icon: Icons.local_cafe_rounded,
      ),
      const AdModel(
        id: 'ad_004',
        businessName: 'SwiftClean Laundry',
        tagline: 'Pick up & delivery within 24 hours. First wash free!',
        ctaText: 'Book Now',
        ctaUrl: 'https://wa.me/919988776655',
        gradientStart: Color(0xFF7C3AED),
        gradientEnd: Color(0xFFA78BFA),
        icon: Icons.local_laundry_service_rounded,
      ),
      // "Advertise Here" placeholder — always last
      const AdModel(
        id: 'ad_placeholder',
        businessName: 'Advertise Here',
        tagline: 'Reach 1,000+ residents in your society. Get started today!',
        ctaText: 'Contact Us',
        ctaUrl: 'mailto:ads@societysphere.com',
        gradientStart: Color(0xFF64748B),
        gradientEnd: Color(0xFF94A3B8),
        icon: Icons.campaign_rounded,
        isAdvertiseHerePlaceholder: true,
      ),
    ];
  }
}
