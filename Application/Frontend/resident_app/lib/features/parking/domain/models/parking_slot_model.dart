class ParkingSlotModel {
  final String id;
  final String slot;
  final String level;
  final String number;
  final String type;
  final String model;
  final String color;
  final String status;
  final String assignedTo;
  final String societyId;

  const ParkingSlotModel({
    required this.id,
    required this.slot,
    required this.level,
    required this.number,
    required this.type,
    required this.model,
    required this.color,
    required this.status,
    required this.assignedTo,
    required this.societyId,
  });

  factory ParkingSlotModel.fromMap(Map<String, dynamic> map, {String? defaultId}) {
    return ParkingSlotModel(
      id: map['id'] as String? ?? defaultId ?? '',
      slot: map['slot'] as String? ?? 'Unknown Slot',
      level: map['level'] as String? ?? 'Level 1',
      number: map['number'] as String? ?? 'XX 00 XX 0000',
      type: map['type'] as String? ?? 'Car',
      model: map['model'] as String? ?? 'Unknown Model',
      color: map['color'] as String? ?? 'Color',
      status: map['status'] as String? ?? 'Active',
      assignedTo: map['assignedTo'] as String? ?? map['uid'] as String? ?? '',
      societyId: map['societyId'] as String? ?? 'SOC-001',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'slot': slot,
      'level': level,
      'number': number,
      'type': type,
      'model': model,
      'color': color,
      'status': status,
      'assignedTo': assignedTo,
      'societyId': societyId,
    };
  }

  ParkingSlotModel copyWith({
    String? id,
    String? slot,
    String? level,
    String? number,
    String? type,
    String? model,
    String? color,
    String? status,
    String? assignedTo,
    String? societyId,
  }) {
    return ParkingSlotModel(
      id: id ?? this.id,
      slot: slot ?? this.slot,
      level: level ?? this.level,
      number: number ?? this.number,
      type: type ?? this.type,
      model: model ?? this.model,
      color: color ?? this.color,
      status: status ?? this.status,
      assignedTo: assignedTo ?? this.assignedTo,
      societyId: societyId ?? this.societyId,
    );
  }
}
