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

  SocietyModel({
    required this.id,
    required this.name,
    required this.code,
    required this.country,
    required this.city,
    required this.blocks,
    required this.totalFlats,
    required this.floors,
  });

  factory SocietyModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    
    // Parse blocks (can be array or count)
    List<String> parsedBlocks = [];
    if (data['blocksList'] is List) {
      parsedBlocks = List<String>.from(data['blocksList']);
    } else if (data['buildings'] is String && (data['buildings'] as String).isNotEmpty) {
      parsedBlocks = (data['buildings'] as String).split(',').map((s) => s.trim()).toList();
    } else if (data['blocks'] != null) {
      int count = int.tryParse(data['blocks'].toString()) ?? 4;
      for (int i = 0; i < count; i++) {
        parsedBlocks.add(String.fromCharCode(65 + i)); // A, B, C, D...
      }
    }
    
    if (parsedBlocks.isEmpty) {
      parsedBlocks = ['A', 'B', 'C', 'D', 'E', 'F'];
    }

    if (!parsedBlocks.contains('COMMON AREA')) {
      parsedBlocks.add('COMMON AREA');
    }
    if (!parsedBlocks.contains('Common Area Vendor')) {
      parsedBlocks.add('Common Area Vendor');
    }

    return SocietyModel(
      id: doc.id,
      name: data['name'] ?? 'Housing Society',
      code: data['code'] ?? doc.id,
      country: data['country'] ?? 'India',
      city: data['city'] ?? 'Hyderabad',
      blocks: parsedBlocks,
      totalFlats: int.tryParse(data['flats']?.toString() ?? '') ?? int.tryParse(data['totalFlats']?.toString() ?? '') ?? 200,
      floors: int.tryParse(data['floors']?.toString() ?? '') ?? 14,
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
      return snapshot.docs.map((doc) => SocietyModel.fromFirestore(doc)).toList();
    } catch (e) {
      return _getFallbackDatabaseSocieties();
    }
  }

  /// Fetch societies filtered by Country and City
  Future<List<SocietyModel>> fetchSocietiesByLocation(String country, String city) async {
    try {
      final snapshot = await _db
          .collection('societies')
          .where('country', isEqualTo: country)
          .where('city', isEqualTo: city)
          .get();

      if (snapshot.docs.isEmpty) {
        // Fallback: search all societies matching city or country
        final all = await fetchAllSocieties();
        final matched = all.where((s) => 
          s.city.toLowerCase() == city.toLowerCase() || 
          s.country.toLowerCase() == country.toLowerCase()
        ).toList();

        return matched.isNotEmpty ? matched : all;
      }

      return snapshot.docs.map((doc) => SocietyModel.fromFirestore(doc)).toList();
    } catch (e) {
      return fetchAllSocieties();
    }
  }

  /// Generate flat numbers dynamically based on society structure (floors and total flats)
  List<String> generateFlatsForSociety(SocietyModel society, String block) {
    List<String> flats = [];

    // Ground floor flats
    flats.addAll(['001', '002', '003', '004']);

    // Floor-based flat numbers (e.g. 101-104, 201-204 ... up to floor count)
    int maxFloors = society.floors > 0 ? society.floors : 14;
    int flatsPerFloor = 4;

    for (int floor = 1; floor <= maxFloors; floor++) {
      for (int unit = 1; unit <= flatsPerFloor; unit++) {
        String flatNo = '${floor}0$unit';
        if (unit >= 10) flatNo = '$floor$unit';
        flats.add(flatNo);
      }
    }

    return flats;
  }

  /// Default fallback societies seeded in Firestore for immediate initial boot if DB is empty
  List<SocietyModel> _getFallbackDatabaseSocieties() {
    return [
      SocietyModel(
        id: 'SOC-001',
        name: 'My Home Bhooja',
        code: 'SOC-001',
        country: 'India',
        city: 'Hyderabad',
        blocks: ['A', 'B', 'C', 'COMMON AREA', 'Common Area Vendor', 'D', 'E', 'F'],
        totalFlats: 500,
        floors: 14,
      ),
      SocietyModel(
        id: 'SOC-002',
        name: 'HITEC City Towers',
        code: 'SOC-002',
        country: 'India',
        city: 'Hyderabad',
        blocks: ['Block 1', 'Block 2', 'Block 3', 'COMMON AREA'],
        totalFlats: 300,
        floors: 12,
      ),
      SocietyModel(
        id: 'SOC-003',
        name: 'Marina Palms Residences',
        code: 'SOC-003',
        country: 'UAE',
        city: 'Dubai',
        blocks: ['Tower A', 'Tower B', 'Penthouse Suite', 'COMMON AREA'],
        totalFlats: 400,
        floors: 25,
      ),
    ];
  }
}
