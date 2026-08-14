import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import '../models/ad_model.dart';
import 'ad_repository.dart';

class AdRepositoryImpl implements AdRepository {
  final FirebaseFirestore _firestore;

  AdRepositoryImpl(this._firestore);

  // Curated premium gradient palettes for dynamic ads
  static const List<List<Color>> _gradients = [
    [Color(0xFF1D4ED8), Color(0xFF60A5FA)], // Royal Blue
    [Color(0xFF047857), Color(0xFF34D399)], // Emerald
    [Color(0xFF7C3AED), Color(0xFFA78BFA)], // Violet
    [Color(0xFFB45309), Color(0xFFFBBF24)], // Amber
    [Color(0xFFBE185D), Color(0xFFF472B6)], // Rose
  ];

  @override
  Stream<List<AdModel>> watchAdCampaigns(String societyId) {
    return _firestore
        .collection('ad_campaigns')
        .snapshots()
        .map((snapshot) {
      final ads = <AdModel>[];
      int colorIdx = 0;

      for (final doc in snapshot.docs) {
        final data = doc.data();
        final status = (data['status'] ?? 'active').toString().toLowerCase();
        if (status != 'active' && status != 'published') continue;

        final target =
            data['target'] ?? data['targetAudience'] ?? 'All Societies';
        if (target != 'All Societies' && target != societyId) continue;

        final title = data['title'] ?? data['name'] ?? 'Special Offer';
        final sponsor = data['sponsor'] ??
            data['client'] ??
            data['companyName'] ??
            'Sponsored';
        final ctaUrl = data['targetUrl'] ?? data['ctaUrl'] ?? data['url'];
        final badge = data['badgeText'] ?? data['ctaText'] ?? 'View Offer';

        final grad = _gradients[colorIdx % _gradients.length];
        colorIdx++;

        ads.add(AdModel(
          id: doc.id,
          businessName: sponsor,
          tagline: title,
          ctaText: badge,
          ctaUrl: ctaUrl,
          gradientStart: grad[0],
          gradientEnd: grad[1],
          icon: Icons.campaign_rounded,
        ));
      }

      // If no live campaigns found in ad_campaigns, fallback to mock demo ads so the section is populated
      if (ads.isEmpty) {
        return AdMockData.getMockAds();
      }

      return ads;
    });
  }
}
