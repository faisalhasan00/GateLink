import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/auth_providers.dart';
import '../data/repositories/notice_repository_impl.dart';
import '../domain/models/notice_model.dart';
import '../domain/repositories/notice_repository.dart';

final noticeRepositoryProvider = Provider<NoticeRepository>((ref) {
  return NoticeRepositoryImpl(FirebaseFirestore.instance);
});

final noticesStreamProvider = StreamProvider<List<NoticeModel>>((ref) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  final repository = ref.watch(noticeRepositoryProvider);
  return repository.watchNotices(societyId);
});

final noticeDetailStreamProvider =
    StreamProvider.family<NoticeModel?, String>((ref, noticeId) {
  final profile = ref.watch(userProfileProvider).value;
  final societyId = profile?.societyId ?? 'SOC-001';

  if (noticeId.isEmpty) return Stream.value(null);
  final repository = ref.watch(noticeRepositoryProvider);
  return repository.watchNoticeDetail(societyId, noticeId);
});
