import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../data/repositories/notice_repository_impl.dart';
import '../domain/repositories/notice_repository.dart';

final noticeRepositoryProvider = Provider<NoticeRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return NoticeRepositoryImpl(firestore: firestore);
});

final noticeDetailProvider = FutureProvider.family<Map<String, dynamic>?, String>((ref, noticeId) async {
  final userProfileAsync = ref.watch(userProfileProvider);
  final societyId = userProfileAsync.value?['societyId'] as String? ?? '';
  final repo = ref.watch(noticeRepositoryProvider);
  return await repo.getNoticeDetail(societyId, noticeId);
});
