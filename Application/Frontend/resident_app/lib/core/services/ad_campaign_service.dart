import 'package:cloud_firestore/cloud_firestore.dart';

/// Domain Micro-Service: Handles Promotional Ad Campaigns & Banners.
class AdCampaignService {
  final FirebaseFirestore _db;

  AdCampaignService({FirebaseFirestore? db})
      : _db = db ?? FirebaseFirestore.instance;

  Stream<QuerySnapshot> adCampaignsStream() {
    return _db
        .collection('ad_campaigns')
        .where('status', isEqualTo: 'Active')
        .snapshots();
  }
}
