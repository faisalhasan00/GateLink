class SocietyModel {
  final String id;
  final String name;
  final String address;
  final String city;
  final String state;
  final String pincode;
  final int totalFlats;
  final int totalWings;
  final String? code;
  final String? logoUrl;

  SocietyModel({
    required this.id,
    required this.name,
    this.address = '',
    this.city = '',
    this.state = '',
    this.pincode = '',
    this.totalFlats = 0,
    this.totalWings = 0,
    this.code,
    this.logoUrl,
  });

  factory SocietyModel.fromFirestore(Map<String, dynamic> data, String id) {
    return SocietyModel(
      id: id,
      name: data['name'] ?? data['society_name'] ?? 'Society $id',
      address: data['address'] ?? '',
      city: data['city'] ?? '',
      state: data['state'] ?? '',
      pincode: data['pincode']?.toString() ?? '',
      totalFlats: data['totalFlats'] ?? data['total_units'] ?? 0,
      totalWings: data['totalWings'] ?? data['wings_count'] ?? 0,
      code: data['code'] ?? data['society_code'],
      logoUrl: data['logoUrl'] ?? data['logo_url'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'address': address,
      'city': city,
      'state': state,
      'pincode': pincode,
      'totalFlats': totalFlats,
      'totalWings': totalWings,
      'code': code,
      'logoUrl': logoUrl,
    };
  }
}
