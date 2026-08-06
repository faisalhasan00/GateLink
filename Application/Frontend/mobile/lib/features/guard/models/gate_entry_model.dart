import 'package:flutter/material.dart';

enum EntryType {
  guest,
  delivery,
  cab,
  dailyHelp,
}

enum EntryStatus {
  inside,
  checkedOut,
  pendingApproval,
  denied,
}

class GateEntryModel {
  final String id;
  final String visitorName;
  final String phone;
  final String flatNumber;
  final String tower;
  final EntryType type;
  final EntryStatus status;
  final DateTime entryTime;
  final DateTime? exitTime;
  final String? vehicleNumber;
  final String? companyName; // e.g. Swiggy, Zomato, Uber, Ola
  final String? purpose;
  final String? qrCode;

  const GateEntryModel({
    required this.id,
    required this.visitorName,
    required this.phone,
    required this.flatNumber,
    required this.tower,
    required this.type,
    required this.status,
    required this.entryTime,
    this.exitTime,
    this.vehicleNumber,
    this.companyName,
    this.purpose,
    this.qrCode,
  });

  String get typeLabel {
    switch (type) {
      case EntryType.guest:
        return 'Guest';
      case EntryType.delivery:
        return companyName ?? 'Delivery';
      case EntryType.cab:
        return companyName ?? 'Cab';
      case EntryType.dailyHelp:
        return 'Daily Help';
    }
  }

  IconData get typeIcon {
    switch (type) {
      case EntryType.guest:
        return Icons.person_rounded;
      case EntryType.delivery:
        return Icons.local_shipping_rounded;
      case EntryType.cab:
        return Icons.local_taxi_rounded;
      case EntryType.dailyHelp:
        return Icons.cleaning_services_rounded;
    }
  }

  Color get typeColor {
    switch (type) {
      case EntryType.guest:
        return const Color(0xFF2563EB); // Blue
      case EntryType.delivery:
        return const Color(0xFFEA580C); // Orange
      case EntryType.cab:
        return const Color(0xFFCA8A04); // Yellow/Amber
      case EntryType.dailyHelp:
        return const Color(0xFF059669); // Emerald Green
    }
  }
}

class GuardRepository {
  static List<GateEntryModel> getMockEntries() {
    final now = DateTime.now();
    return [
      GateEntryModel(
        id: 'entry_101',
        visitorName: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        flatNumber: '302',
        tower: 'Tower B',
        type: EntryType.delivery,
        companyName: 'Zomato',
        status: EntryStatus.inside,
        entryTime: now.subtract(const Duration(minutes: 12)),
        vehicleNumber: 'MH 12 AB 1234',
      ),
      GateEntryModel(
        id: 'entry_102',
        visitorName: 'Anil Sharma',
        phone: '+91 91234 56789',
        flatNumber: '101',
        tower: 'Tower A',
        type: EntryType.guest,
        purpose: 'Personal Visit',
        status: EntryStatus.inside,
        entryTime: now.subtract(const Duration(minutes: 45)),
        vehicleNumber: 'MH 14 CD 5678',
      ),
      GateEntryModel(
        id: 'entry_103',
        visitorName: 'Sunita Maid',
        phone: '+91 99887 76655',
        flatNumber: '504',
        tower: 'Tower C',
        type: EntryType.dailyHelp,
        status: EntryStatus.inside,
        entryTime: now.subtract(const Duration(hours: 2)),
      ),
      GateEntryModel(
        id: 'entry_104',
        visitorName: 'Uber Cab (Ramesh)',
        phone: '+91 97654 32109',
        flatNumber: '203',
        tower: 'Tower A',
        type: EntryType.cab,
        companyName: 'Uber',
        status: EntryStatus.pendingApproval,
        entryTime: now.subtract(const Duration(minutes: 2)),
        vehicleNumber: 'MH 12 EF 9012',
      ),
      GateEntryModel(
        id: 'entry_105',
        visitorName: 'Vikram Singh',
        phone: '+91 95432 10987',
        flatNumber: '402',
        tower: 'Tower B',
        type: EntryType.guest,
        status: EntryStatus.checkedOut,
        entryTime: now.subtract(const Duration(hours: 3)),
        exitTime: now.subtract(const Duration(hours: 1)),
      ),
    ];
  }
}
