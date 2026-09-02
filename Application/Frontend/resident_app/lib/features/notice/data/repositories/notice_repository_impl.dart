import 'package:cloud_firestore/cloud_firestore.dart';
import '../../domain/models/notice_model.dart';
import '../../domain/repositories/notice_repository.dart';

class NoticeRepositoryImpl implements NoticeRepository {
  final FirebaseFirestore _firestore;

  NoticeRepositoryImpl([FirebaseFirestore? firestore])
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Stream<List<NoticeModel>> watchNotices(String societyId) {
    if (societyId.isEmpty) return Stream.value([]);

    return _firestore
        .collection('societies/$societyId/notices')
        .orderBy('createdAt', descending: true)
        .limit(50)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => NoticeModel.fromMap(doc.data(), defaultId: doc.id))
          .toList();
    });
  }

  @override
  Stream<NoticeModel?> watchNoticeDetail(String societyId, String noticeId) {
    if (societyId.isEmpty || noticeId.isEmpty) return Stream.value(null);

    return _firestore
        .collection('societies/$societyId/notices')
        .doc(noticeId)
        .snapshots()
        .map((doc) {
      if (!doc.exists || doc.data() == null) return null;
      return NoticeModel.fromMap(doc.data()!, defaultId: doc.id);
    });
  }

  @override
  Future<void> seedDemoNotices(String societyId) async {
    if (societyId.isEmpty) return;

    final batch = _firestore.batch();
    final now = DateTime.now();

    final demoNotices = [
      {
        'title': '🚰 Water Tank Cleaning & Maintenance',
        'description':
            'Annual overhead and underground water tank deep cleaning is scheduled for this Saturday from 9:00 AM to 2:00 PM. Water supply will be temporarily paused. Please store adequate water for morning use.',
        'category': 'Maintenance',
        'author': 'Estate Management Office',
        'authorRole': 'Facility Head',
        'date': '${now.day}/${now.month}/${now.year}',
        'createdAt': now.toIso8601String(),
        'isUrgent': false,
      },
      {
        'title': '🚨 Fire Drill & Evacuation Training',
        'description':
            'Mandatory society-wide fire evacuation and alarm drill conducted with local Fire Department officers on Sunday at 11:00 AM in the Central Garden. All residents and staff are urged to participate.',
        'category': 'Emergency',
        'author': 'Security Committee',
        'authorRole': 'Chief Security Officer',
        'date': '${now.day}/${now.month}/${now.year}',
        'createdAt': now.subtract(const Duration(hours: 3)).toIso8601String(),
        'isUrgent': true,
      },
      {
        'title': '🎉 Annual Diwali & Cultural Fest 2026',
        'description':
            'Join us for the Grand Community Diwali Celebration with live musical performances, food stalls, kids fancy dress competition, and eco-friendly fireworks at the Clubhouse Lawn.',
        'category': 'Events',
        'author': 'Cultural Committee',
        'authorRole': 'Event Coordinator',
        'date': '${now.day}/${now.month}/${now.year}',
        'createdAt': now.subtract(const Duration(days: 1)).toIso8601String(),
        'isUrgent': false,
      },
    ];

    for (final notice in demoNotices) {
      final docRef = _firestore.collection('societies/$societyId/notices').doc();
      batch.set(docRef, notice);
    }

    await batch.commit();
  }
}
