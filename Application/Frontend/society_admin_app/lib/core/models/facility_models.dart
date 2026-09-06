class AmenityModel {
  final String id;
  final String name;
  final String description;
  final int capacity;
  final double bookingFee;
  final String timings;
  final bool isAvailable;

  AmenityModel({
    required this.id,
    required this.name,
    this.description = '',
    this.capacity = 0,
    this.bookingFee = 0.0,
    this.timings = '6:00 AM - 10:00 PM',
    this.isAvailable = true,
  });

  factory AmenityModel.fromFirestore(Map<String, dynamic> data, String id) {
    return AmenityModel(
      id: id,
      name: data['name'] ?? data['amenityName'] ?? 'Amenity #$id',
      description: data['description'] ?? '',
      capacity: (data['capacity'] ?? 0) is int ? (data['capacity'] ?? 0) : int.tryParse(data['capacity'].toString()) ?? 0,
      bookingFee: (data['bookingFee'] ?? data['fee'] ?? 0).toDouble(),
      timings: data['timings'] ?? data['slotTimings'] ?? '6:00 AM - 10:00 PM',
      isAvailable: data['isAvailable'] ?? data['status'] == 'active' || data['status'] == null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'capacity': capacity,
      'bookingFee': bookingFee,
      'timings': timings,
      'isAvailable': isAvailable,
      'createdAt': DateTime.now().toIso8601String(),
    };
  }
}

class AmenityBookingModel {
  final String id;
  final String amenityName;
  final String residentName;
  final String flatNo;
  final String slotDate;
  final String slotTime;
  final String status; // 'approved', 'pending', 'rejected'

  AmenityBookingModel({
    required this.id,
    required this.amenityName,
    required this.residentName,
    required this.flatNo,
    required this.slotDate,
    required this.slotTime,
    this.status = 'pending',
  });

  factory AmenityBookingModel.fromFirestore(Map<String, dynamic> data, String id) {
    return AmenityBookingModel(
      id: id,
      amenityName: data['amenityName'] ?? data['amenity'] ?? 'Amenity',
      residentName: data['residentName'] ?? data['userName'] ?? 'Resident',
      flatNo: data['flatNo'] ?? data['flat_no'] ?? '',
      slotDate: data['slotDate'] ?? data['date'] ?? 'Today',
      slotTime: data['slotTime'] ?? data['timeSlot'] ?? '',
      status: (data['status'] ?? 'pending').toString().toLowerCase(),
    );
  }
}

class StaffModel {
  final String id;
  final String name;
  final String role; // 'Guard', 'Electrician', 'Plumber', 'Manager', 'Gardener'
  final String phone;
  final String shift; // 'Morning (6am-2pm)', 'Evening (2pm-10pm)', 'Night (10pm-6am)'
  final String status; // 'on_duty', 'off_duty'

  StaffModel({
    required this.id,
    required this.name,
    required this.role,
    required this.phone,
    this.shift = 'Morning',
    this.status = 'on_duty',
  });

  factory StaffModel.fromFirestore(Map<String, dynamic> data, String id) {
    return StaffModel(
      id: id,
      name: data['name'] ?? data['fullName'] ?? 'Staff Member',
      role: data['role'] ?? data['designation'] ?? 'Guard',
      phone: data['phone'] ?? data['mobileNumber'] ?? '',
      shift: data['shift'] ?? data['shiftTiming'] ?? 'General',
      status: (data['status'] ?? 'on_duty').toString().toLowerCase(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'role': role,
      'phone': phone,
      'shift': shift,
      'status': status,
      'createdAt': DateTime.now().toIso8601String(),
    };
  }
}

class HelperModel {
  final String id;
  final String name;
  final String helperType; // 'Maid', 'Cook', 'Driver', 'Car Cleaner', 'Nanny'
  final String phone;
  final String assignedFlats;
  final String status; // 'inside', 'exited'

  HelperModel({
    required this.id,
    required this.name,
    required this.helperType,
    required this.phone,
    this.assignedFlats = '',
    this.status = 'exited',
  });

  factory HelperModel.fromFirestore(Map<String, dynamic> data, String id) {
    return HelperModel(
      id: id,
      name: data['name'] ?? data['fullName'] ?? 'Daily Help',
      helperType: data['helperType'] ?? data['serviceType'] ?? 'Maid',
      phone: data['phone'] ?? data['mobile'] ?? '',
      assignedFlats: data['assignedFlats'] ?? data['flats'] ?? '',
      status: (data['status'] ?? 'exited').toString().toLowerCase(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'helperType': helperType,
      'phone': phone,
      'assignedFlats': assignedFlats,
      'status': status,
      'createdAt': DateTime.now().toIso8601String(),
    };
  }
}

class PollModel {
  final String id;
  final String question;
  final List<String> options;
  final Map<String, int> votes;
  final int totalVotes;
  final bool isClosed;
  final String createdBy;

  PollModel({
    required this.id,
    required this.question,
    required this.options,
    required this.votes,
    required this.totalVotes,
    this.isClosed = false,
    this.createdBy = 'Society Committee',
  });

  factory PollModel.fromFirestore(Map<String, dynamic> data, String id) {
    final rawOptions = data['options'] as List<dynamic>? ?? ['Yes', 'No'];
    final options = rawOptions.map((e) => e.toString()).toList();
    
    final votesMap = <String, int>{};
    int total = 0;
    if (data['votes'] is Map) {
      (data['votes'] as Map).forEach((k, v) {
        final count = (v is int) ? v : int.tryParse(v.toString()) ?? 0;
        votesMap[k.toString()] = count;
        total += count;
      });
    }

    return PollModel(
      id: id,
      question: data['question'] ?? data['title'] ?? 'Community Poll',
      options: options,
      votes: votesMap,
      totalVotes: data['totalVotes'] ?? total,
      isClosed: data['isClosed'] == true || data['status'] == 'closed',
      createdBy: data['createdBy'] ?? 'Society Committee',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'question': question,
      'options': options,
      'votes': votes,
      'totalVotes': totalVotes,
      'isClosed': isClosed,
      'createdBy': createdBy,
      'createdAt': DateTime.now().toIso8601String(),
    };
  }
}

class ParkingSlotModel {
  final String id;
  final String slotNumber;
  final String slotType; // 'Covered 4-Wheeler', 'Open 4-Wheeler', '2-Wheeler'
  final String assignedFlat;
  final String residentName;
  final String vehicleNumber;
  final bool isOccupied;

  ParkingSlotModel({
    required this.id,
    required this.slotNumber,
    required this.slotType,
    this.assignedFlat = '',
    this.residentName = '',
    this.vehicleNumber = '',
    this.isOccupied = false,
  });

  factory ParkingSlotModel.fromFirestore(Map<String, dynamic> data, String id) {
    return ParkingSlotModel(
      id: id,
      slotNumber: data['slotNumber'] ?? data['slot_no'] ?? 'Slot #$id',
      slotType: data['slotType'] ?? data['type'] ?? 'Covered 4-Wheeler',
      assignedFlat: data['assignedFlat'] ?? data['flat_no'] ?? '',
      residentName: data['residentName'] ?? data['assignedTo'] ?? '',
      vehicleNumber: data['vehicleNumber'] ?? data['vehicle_no'] ?? '',
      isOccupied: data['isOccupied'] == true || (data['assignedFlat']?.toString().isNotEmpty == true),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'slotNumber': slotNumber,
      'slotType': slotType,
      'assignedFlat': assignedFlat,
      'residentName': residentName,
      'vehicleNumber': vehicleNumber,
      'isOccupied': isOccupied,
    };
  }
}

class DocumentRecordModel {
  final String id;
  final String title;
  final String category; // 'Bylaws', 'AGM Minutes', 'Financials', 'Audit', 'Vendor Contracts'
  final String fileUrl;
  final String uploadedBy;
  final String uploadedAt;

  DocumentRecordModel({
    required this.id,
    required this.title,
    required this.category,
    required this.fileUrl,
    this.uploadedBy = 'Admin',
    this.uploadedAt = '',
  });

  factory DocumentRecordModel.fromFirestore(Map<String, dynamic> data, String id) {
    return DocumentRecordModel(
      id: id,
      title: data['title'] ?? data['name'] ?? 'Document #$id',
      category: data['category'] ?? 'General',
      fileUrl: data['fileUrl'] ?? data['url'] ?? '',
      uploadedBy: data['uploadedBy'] ?? 'Admin',
      uploadedAt: data['uploadedAt'] ?? data['createdAt'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'category': category,
      'fileUrl': fileUrl,
      'uploadedBy': uploadedBy,
      'uploadedAt': DateTime.now().toIso8601String(),
    };
  }
}
