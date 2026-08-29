import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/helper_log_model.dart';
import '../../domain/models/helper_model.dart';
import '../../domain/repositories/helper_repository.dart';

class HelperRepositoryImpl implements HelperRepository {
  final FirebaseFirestore _firestore;

  HelperRepositoryImpl({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<HelperModel>> watchRegisteredHelpers(String societyId, {String? residentUid}) {
    if (societyId.isEmpty) return Stream.value([]);

    Query query = _firestore.collection('societies/$societyId/helpers');
    if (residentUid != null && residentUid.isNotEmpty) {
      query = query.where('residentUid', isEqualTo: residentUid);
    }

    return query.snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => HelperModel.fromMap(doc.data() as Map<String, dynamic>, doc.id))
          .toList();
    });
  }

  @override
  Stream<List<HelperLogModel>> watchHelperLogs(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/helper_logs')
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs
          .map((doc) => HelperLogModel.fromMap(doc.data() as Map<String, dynamic>, defaultId: doc.id))
          .toList();
      list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      return list;
    });
  }

  @override
  Future<void> registerHelper(String societyId, HelperModel helper) async {
    if (societyId.isEmpty) throw ArgumentError('Society ID is required');
    await _firestore.collection('societies/$societyId/helpers').add(helper.toMap());
  }

  @override
  Future<void> logHelperEntryExit(String societyId, HelperLogModel log) async {
    if (societyId.isEmpty) throw ArgumentError('Society ID is required');
    await _firestore.collection('societies/$societyId/helper_logs').add(log.toMap());
  }
}
