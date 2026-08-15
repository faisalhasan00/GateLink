import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/ad_model.dart';
import 'ad_repository.dart';

class AdRepositoryImpl implements AdRepository {
  final FirebaseFirestore _firestore;

  AdRepositoryImpl(this._firestore);

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

        ads.add(AdModel.fromMap(doc.id, data, colorIdx++));
      }

      return ads;
    });
  }
}
