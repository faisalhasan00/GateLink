import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import '../models/ad_model.dart';
import 'ad_repository.dart';

class AdRepositoryImpl implements AdRepository {
  final FirebaseFirestore _firestore;

  AdRepositoryImpl(this._firestore);

  @override
  Stream<List<AdModel>> watchAdCampaigns(String societyId) {
    return _firestore
        .collection('societies/$societyId/ads')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        return AdModel(
          id: doc.id,
          businessName: data['companyName'] ?? data['title'] ?? 'Advertisement',
          tagline: data['description'] ?? '',
          ctaText: data['badgeText'] ?? 'Offer',
          ctaUrl: data['targetUrl'],
          gradientStart: const Color(0xFF1D4ED8),
          gradientEnd: const Color(0xFF60A5FA),
          icon: Icons.campaign_rounded,
        );
      }).toList();
    });
  }
}
