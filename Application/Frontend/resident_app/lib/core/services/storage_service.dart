import 'dart:convert';
import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});

class StorageService {
  final FirebaseStorage? _customStorage;

  StorageService([this._customStorage]);

  FirebaseStorage get _storage => _customStorage ?? FirebaseStorage.instance;

  /// Uploads a profile photo to Firebase Storage and returns the download URL.
  /// If Firebase Storage is not provisioned/enabled in Firebase console,
  /// smoothly falls back to a base64 Data URI so the user never sees an error.
  Future<String> uploadProfilePhoto(File imageFile, String uid) async {
    try {
      final ref = _storage.ref().child('profile_photos/$uid.jpg');
      final metadata = SettableMetadata(contentType: 'image/jpeg');
      final uploadTask = await ref.putFile(imageFile, metadata);
      return await uploadTask.ref.getDownloadURL();
    } catch (e) {
      print('Firebase Storage Profile Photo Fallback: $e');
      final bytes = await imageFile.readAsBytes();
      final base64Str = base64Encode(bytes);
      return 'data:image/jpeg;base64,$base64Str';
    }
  }

  /// Uploads an image to Firebase Storage and returns the download URL
  Future<String> uploadComplaintImage(
      File imageFile, String societyId, String complaintId) async {
    try {
      final fileName = 'image_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage
          .ref()
          .child('societies/$societyId/complaints/$complaintId/$fileName');

      final uploadTask = await ref.putFile(imageFile);
      return await uploadTask.ref.getDownloadURL();
    } catch (e) {
      print('Firebase Storage Complaint Fallback: $e');
      try {
        final bytes = await imageFile.readAsBytes();
        final base64Str = base64Encode(bytes);
        return 'data:image/jpeg;base64,$base64Str';
      } catch (_) {
        return '';
      }
    }
  }
}
