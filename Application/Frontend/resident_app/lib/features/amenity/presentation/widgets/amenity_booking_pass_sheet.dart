import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/router/app_router.dart';

class AmenityBookingPassSheet extends StatelessWidget {
  final String amenityId;
  final String amenityName;
  final String flatNumber;
  final String residentName;
  final DateTime selectedDate;
  final String selectedSlot;

  const AmenityBookingPassSheet({
    super.key,
    required this.amenityId,
    required this.amenityName,
    required this.flatNumber,
    required this.residentName,
    required this.selectedDate,
    required this.selectedSlot,
  });

  static void show(
    BuildContext context, {
    required String amenityId,
    required String amenityName,
    required String flatNumber,
    required String residentName,
    required DateTime selectedDate,
    required String selectedSlot,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AmenityBookingPassSheet(
        amenityId: amenityId,
        amenityName: amenityName,
        flatNumber: flatNumber,
        residentName: residentName,
        selectedDate: selectedDate,
        selectedSlot: selectedSlot,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final formattedDate =
        DateFormat('EEE, dd MMM yyyy').format(selectedDate);
    final passCode =
        'AMN-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: const Color(0xFFCBD5E1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          const Icon(Icons.check_circle_rounded,
              color: Color(0xFF10B981), size: 52),
          const SizedBox(height: 8),
          const Text(
            'Amenity Slot Confirmed!',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Show this QR pass to the facility attendant or guard.',
            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                QrImageView(
                  data: 'GATELINK:AMENITY:$passCode:$amenityId',
                  version: QrVersions.auto,
                  size: 140,
                ),
                const SizedBox(height: 12),
                Text(
                  passCode,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 2,
                    color: Color(0xFF1E3A8A),
                  ),
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildPassDetail('Facility', amenityName),
                    _buildPassDetail('Date', formattedDate),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildPassDetail('Slot', selectedSlot),
                    _buildPassDetail(
                        'Unit', 'Flat $flatNumber ($residentName)'),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                context.go(AppRoutes.myBookings);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A8A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: const Text(
                'View in My Bookings',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPassDetail(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: Color(0xFF94A3B8),
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: Color(0xFF0F172A),
          ),
        ),
      ],
    );
  }
}
