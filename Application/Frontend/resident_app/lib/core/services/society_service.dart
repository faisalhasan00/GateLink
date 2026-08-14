import 'package:cloud_firestore/cloud_firestore.dart';

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
      city: data['city'] ?? 'Hyderabad',
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
        return _getFallbackDatabaseSocieties();
      }
      return snapshot.docs
          .map((doc) => SocietyModel.fromFirestore(doc))
          .toList();
    } catch (e) {
      return _getFallbackDatabaseSocieties();
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
        // Fallback: search all societies matching city or country
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

  /// Generate flat numbers dynamically based on starting flat number and flats per block
  List<String> generateFlatsForSociety(SocietyModel society, String block) {
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
      flats.add(flatStr);
    }

    return flats;
  }

  /// Return empty list when no societies exist in database
  List<SocietyModel> _getFallbackDatabaseSocieties() {
    return [];
  }
}
