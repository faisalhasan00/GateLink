import 'package:flutter/material.dart';

/// Represents a single real advertisement campaign poster in the carousel.
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

  factory AdModel.fromMap(String id, Map<String, dynamic> data, int colorIndex) {
    const gradients = [
      [Color(0xFF1D4ED8), Color(0xFF60A5FA)], // Royal Blue
      [Color(0xFF047857), Color(0xFF34D399)], // Emerald
      [Color(0xFF7C3AED), Color(0xFFA78BFA)], // Violet
      [Color(0xFFB45309), Color(0xFFFBBF24)], // Amber
      [Color(0xFFBE185D), Color(0xFFF472B6)], // Rose
    ];

    final grad = gradients[colorIndex % gradients.length];
    final title = data['title'] ?? data['name'] ?? 'Special Offer';
    final sponsor = data['sponsor'] ??
        data['client'] ??
        data['companyName'] ??
        'Sponsored';
    final ctaUrl = data['targetUrl'] ?? data['ctaUrl'] ?? data['url'];
    final badge = data['badgeText'] ?? data['ctaText'] ?? 'View Offer';

    return AdModel(
      id: id,
      businessName: sponsor.toString(),
      tagline: title.toString(),
      ctaText: badge.toString(),
      ctaUrl: ctaUrl?.toString(),
      gradientStart: grad[0],
      gradientEnd: grad[1],
      icon: Icons.campaign_rounded,
      isAdvertiseHerePlaceholder: data['isPlaceholder'] == true,
    );
  }
}
