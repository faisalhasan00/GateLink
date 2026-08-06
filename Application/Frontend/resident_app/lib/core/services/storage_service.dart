import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  /// Uploads an image to Firebase Storage and returns the download URL
  Future<String> uploadComplaintImage(File imageFile, String societyId, String complaintId) async {
    try {
      final fileName = 'image_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage.ref().child('societies/$societyId/complaints/$complaintId/$fileName');
      
      final uploadTask = await ref.putFile(imageFile);
      return await uploadTask.ref.getDownloadURL();
    } catch (e) {
      // If storage is not initialized or fails, just return empty so the complaint can still be raised.
      print('Firebase Storage Error: $e');
      return '';
    }
  }
}
