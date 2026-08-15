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
