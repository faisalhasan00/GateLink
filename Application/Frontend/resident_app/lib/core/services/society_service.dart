import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final societyServiceProvider = Provider<SocietyService>((ref) {
  return SocietyService();
});

class SocietyModel {
  final String id;
  final String name;
  final String code;
  final String country;
  final String city;
  final List<String> blocks;
  final int totalFlats;
  final int floors;
  final int flatsPerBlock;
  final int startFlatNumber;

  SocietyModel({
    required this.id,
    required this.name,
    required this.code,
    required this.country,
    required this.city,
    required this.blocks,
    required this.totalFlats,
    required this.floors,
    this.flatsPerBlock = 50,
    this.startFlatNumber = 101,
  });

  factory SocietyModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};

    // Parse blocks dynamically from Firestore document ONLY
    List<String> parsedBlocks = [];
    if (data['blocksList'] is List && (data['blocksList'] as List).isNotEmpty) {
      parsedBlocks = List<String>.from(data['blocksList']);
    } else if (data['buildings'] is String &&
        (data['buildings'] as String).trim().isNotEmpty) {
      parsedBlocks = (data['buildings'] as String)
          .split(',')
          .map((s) => s.trim())
          .where((s) => s.isNotEmpty)
          .toList();
    } else if (data['blocks'] != null) {
      int count = int.tryParse(data['blocks'].toString()) ?? 0;
      for (int i = 0; i < count; i++) {
        parsedBlocks.add('Block ${String.fromCharCode(65 + i)}');
      }
    }

    return SocietyModel(
      id: doc.id,
      name: data['name'] ?? 'Housing Society',
      code: data['code'] ?? doc.id,
      country: data['country'] ?? 'India',
      city: data['city'] ?? 'FAROOQNAGAR',
      blocks: parsedBlocks,
      totalFlats: int.tryParse(data['flats']?.toString() ?? '') ??
          int.tryParse(data['totalFlats']?.toString() ?? '') ??
          200,
      floors: int.tryParse(data['floors']?.toString() ?? '') ?? 14,
      flatsPerBlock:
          int.tryParse(data['flatsPerBlock']?.toString() ?? '') ?? 50,
      startFlatNumber:
          int.tryParse(data['startFlatNumber']?.toString() ?? '') ?? 101,
    );
  }
}

class SocietyService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Fetch all active societies from Firestore database
  Future<List<SocietyModel>> fetchAllSocieties() async {
    try {
      final snapshot = await _db.collection('societies').get();
      if (snapshot.docs.isEmpty) {
        return [];
      }
      return snapshot.docs
          .map((doc) => SocietyModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Fetch societies filtered by Country and City
  Future<List<SocietyModel>> fetchSocietiesByLocation(
      String country, String city) async {
    try {
      final snapshot = await _db
          .collection('societies')
          .where('country', isEqualTo: country)
          .where('city', isEqualTo: city)
          .get();

      if (snapshot.docs.isEmpty) {
        final all = await fetchAllSocieties();
        final matched = all
            .where((s) =>
                s.city.toLowerCase() == city.toLowerCase() ||
                s.country.toLowerCase() == country.toLowerCase())
            .toList();

        return matched.isNotEmpty ? matched : all;
      }

      return snapshot.docs
          .map((doc) => SocietyModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      return fetchAllSocieties();
    }
  }

  /// Fetch occupied flats for a given society and block
  Future<Set<String>> fetchOccupiedFlats(String societyId, String block) async {
    final Set<String> occupied = {};
    if (societyId.isEmpty) return occupied;

    final cleanBlock = block.replaceAll(RegExp(r'^(Block|Tower)\s*', caseSensitive: false), '').trim();

    try {
      // 1. Query subcollection `societies/$societyId/users`
      final subUsersSnap = await _db.collection('societies/$societyId/users').get();
      for (final doc in subUsersSnap.docs) {
        final data = doc.data();
        _extractAndAddOccupiedFlat(data, cleanBlock, occupied);
      }

      // 2. Query root `users` collection where `societyId == societyId`
      final rootUsersSnap = await _db.collection('users').where('societyId', isEqualTo: societyId).get();
      for (final doc in rootUsersSnap.docs) {
        final data = doc.data();
        _extractAndAddOccupiedFlat(data, cleanBlock, occupied);
      }
    } catch (e) {
      print('Error fetching occupied flats: $e');
    }

    return occupied;
  }

  void _extractAndAddOccupiedFlat(Map<String, dynamic> data, String targetBlock, Set<String> occupied) {
    final rawFlat = (data['flatNumber'] ?? data['flat'] ?? '').toString().trim();
    final rawTower = (data['tower'] ?? data['buildingBlock'] ?? data['block'] ?? '').toString().trim();
    final cleanTower = rawTower.replaceAll(RegExp(r'^(Block|Tower)\s*', caseSensitive: false), '').trim();

    if (rawFlat.isEmpty) return;

    // Check if block matches or is part of the flat string (e.g. "A-101")
    if (cleanTower.isNotEmpty && cleanTower.toUpperCase() == targetBlock.toUpperCase()) {
      final flatOnly = rawFlat.contains('-') ? rawFlat.split('-').last.trim() : rawFlat;
      occupied.add(flatOnly);
      occupied.add(rawFlat);
    } else if (rawFlat.contains('-')) {
      final parts = rawFlat.split('-');
      final blockPart = parts.first.replaceAll(RegExp(r'^(Block|Tower)\s*', caseSensitive: false), '').trim();
      if (blockPart.toUpperCase() == targetBlock.toUpperCase()) {
        occupied.add(parts.last.trim());
        occupied.add(rawFlat);
      }
    } else if (cleanTower.isEmpty) {
      occupied.add(rawFlat);
    }
  }

  /// Generate available flat numbers dynamically, excluding any occupied flats
  List<String> generateFlatsForSociety(
    SocietyModel society,
    String block, {
    Set<String> occupiedFlats = const {},
  }) {
    List<String> flats = [];

    int start = society.startFlatNumber > 0 ? society.startFlatNumber : 101;
    int count = society.flatsPerBlock > 0 ? society.flatsPerBlock : 50;

    for (int i = 0; i < count; i++) {
      int num = start + i;
      String flatStr = num < 10
          ? '00$num'
          : num < 100
              ? '0$num'
              : '$num';

      // Only include if NOT already occupied by another resident
      if (!occupiedFlats.contains(flatStr) &&
          !occupiedFlats.contains('$block-$flatStr') &&
          !occupiedFlats.contains('${block.replaceAll('Block ', '')}-$flatStr')) {
        flats.add(flatStr);
      }
    }

    return flats;
  }
}
