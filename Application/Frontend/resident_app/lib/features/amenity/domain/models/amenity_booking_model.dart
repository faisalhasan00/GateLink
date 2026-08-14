class AmenityBookingModel {
  final String id;
  final String amenityId;
  final String amenityName;
  final String bookedBy;
  final String residentName;
  final String flatNumber;
  final String phone;
  final String date;
  final String timeSlot;
  final int guests;
  final String specialNotes;
  final String status;
  final String approvalPolicy;
  final String societyId;
  final String createdAt;

  const AmenityBookingModel({
    required this.id,
    required this.amenityId,
    required this.amenityName,
    required this.bookedBy,
    required this.residentName,
    required this.flatNumber,
    required this.phone,
    required this.date,
    required this.timeSlot,
    this.guests = 1,
    this.specialNotes = '',
    this.status = 'approved',
    this.approvalPolicy = 'auto',
    required this.societyId,
    required this.createdAt,
  });

  bool get isConfirmed => status == 'confirmed' || status == 'approved';
  bool get isCancelled => status == 'cancelled';
  bool get isPending => status == 'pending';

  factory AmenityBookingModel.fromMap(
      Map<String, dynamic> map, String documentId) {
    return AmenityBookingModel(
      id: documentId,
      amenityId: map['amenityId'] as String? ?? '',
      amenityName:
          map['amenityName'] as String? ?? map['name'] as String? ?? 'Amenity',
      bookedBy: map['bookedBy'] as String? ??
          map['residentUid'] as String? ??
          map['uid'] as String? ??
          '',
      residentName: map['residentName'] as String? ??
          map['userName'] as String? ??
          'Unknown User',
      flatNumber: map['flatNumber'] as String? ?? '',
      phone: map['phone'] as String? ?? '',
      date: map['date'] as String? ?? map['bookingDate'] as String? ?? '',
      timeSlot: map['timeSlot'] as String? ?? '',
      guests: (map['guests'] as num?)?.toInt() ?? 1,
      specialNotes: map['specialNotes'] as String? ?? '',
      status: map['status'] as String? ?? 'approved',
      approvalPolicy: map['approvalPolicy'] as String? ?? 'auto',
      societyId: map['societyId'] as String? ?? 'SOC-001',
      createdAt: map['createdAt'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'amenityId': amenityId,
      'amenityName': amenityName,
      'bookedBy': bookedBy,
      'residentUid': bookedBy,
      'residentName': residentName,
      'flatNumber': flatNumber,
      'phone': phone,
      'date': date,
      'timeSlot': timeSlot,
      'guests': guests,
      'specialNotes': specialNotes,
      'status': status,
      'approvalPolicy': approvalPolicy,
      'societyId': societyId,
      'createdAt': createdAt,
    };
  }
}
