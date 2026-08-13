class AmenityModel {
  final String id;
  final String name;
  final String iconKey;
  final String timing;
  final bool available;
  final String? status;
  final String fee;
  final String location;
  final int? availableSlots;
  final int capacity;

  const AmenityModel({
    required this.id,
    required this.name,
    this.iconKey = 'pool',
    this.timing = '06:00 AM - 10:00 PM',
    this.available = true,
    this.status = 'Available',
    this.fee = 'Free',
    this.location = '',
    this.availableSlots,
    this.capacity = 10,
  });

  factory AmenityModel.fromMap(Map<String, dynamic> map, String documentId) {
    final rawTiming = map['timing'] as String? ?? map['timings'] as String? ?? '06:00 AM - 10:00 PM';
    final isAvailableStatus = map['status'] == 'Available';
    final isAvailable = map['available'] == true || isAvailableStatus;
    
    final maxQuota = (map['capacity'] as num?)?.toInt() ?? 
                     (map['maxSlots'] as num?)?.toInt() ?? 10;
                     
    final rawFee = map['fee'] as String? ?? 
                  (map['pricePerHour'] != null && (map['pricePerHour'] as num) > 0 
                      ? '₹${map['pricePerHour']}/hr' 
                      : 'Free');

    return AmenityModel(
      id: documentId,
      name: map['name'] as String? ?? 'Amenity',
      iconKey: map['iconKey'] as String? ?? 'pool',
      timing: rawTiming,
      available: isAvailable,
      status: map['status'] as String? ?? 'Available',
      fee: rawFee,
      location: map['location'] as String? ?? '',
      availableSlots: (map['availableSlots'] as num?)?.toInt(),
      capacity: maxQuota,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'iconKey': iconKey,
      'timing': timing,
      'available': available,
      'status': status,
      'fee': fee,
      'location': location,
      'availableSlots': availableSlots,
      'capacity': capacity,
    };
  }
}
