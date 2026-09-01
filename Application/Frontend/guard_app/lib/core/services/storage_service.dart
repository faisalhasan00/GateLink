import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  /// Uploads a complaint image to Firebase Storage and returns the download URL
  Future<String> uploadComplaintImage(File imageFile, String societyId, String complaintId) async {
    try {
      final fileName = 'image_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage.ref().child('societies/$societyId/complaints/$complaintId/$fileName');
      
      final uploadTask = await ref.putFile(imageFile);
      return await uploadTask.ref.getDownloadURL();
    } catch (e) {
      // If storage is not initialized or fails, just return empty so the complaint can still be raised.
      print('Firebase Storage Complaint Error: $e');
      return '';
    }
  }

  /// Uploads a visitor photo to Firebase Storage and returns the download URL
  Future<String> uploadVisitorPhoto(File imageFile, String societyId, String visitorId) async {
    try {
      final fileName = 'visitor_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage.ref().child('societies/$societyId/visitors/$visitorId/$fileName');
      
      final uploadTask = await ref.putFile(imageFile);
      return await uploadTask.ref.getDownloadURL();
    } catch (e) {
      print('Firebase Storage Visitor Error: $e');
      return '';
    }
  }
}
