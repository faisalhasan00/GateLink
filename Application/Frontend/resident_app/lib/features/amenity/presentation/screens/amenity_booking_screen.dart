import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/amenity_model.dart';
import '../../providers/amenity_providers.dart';
import '../widgets/amenity_booking_pass_sheet.dart';
import '../widgets/amenity_date_strip.dart';
import '../widgets/amenity_guest_stepper.dart';
import '../widgets/amenity_header_card.dart';
import '../widgets/amenity_slot_picker.dart';

class AmenityBookingScreen extends ConsumerStatefulWidget {
  final String amenityId;
  const AmenityBookingScreen({super.key, required this.amenityId});

  @override
  ConsumerState<AmenityBookingScreen> createState() =>
      _AmenityBookingScreenState();
}

class _AmenityBookingScreenState extends ConsumerState<AmenityBookingScreen> {
  DateTime _selectedDate = DateTime.now();
  String? _selectedSlot;
  int _guestCount = 1;

  AmenityModel? _amenityModel;
  bool _isLoadingAmenity = true;

  final List<String> _morningSlots = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
  ];

  final List<String> _eveningSlots = [
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
  ];

  Set<String> _bookedSlots = {};
  bool _isFetchingSlots = false;

  @override
  void initState() {
    super.initState();
    _fetchAmenityProfile();
    _fetchBookedSlots(_selectedDate);
  }

  Future<void> _fetchAmenityProfile() async {
    try {
      final profile = ref.read(userProfileProvider).value;
      final activeSocId = profile?.societyId ?? 'SOC-001';
      final repository = ref.read(amenityRepositoryProvider);

      final amenity =
          await repository.fetchAmenityById(activeSocId, widget.amenityId);
      if (mounted) {
        setState(() {
          _amenityModel = amenity;
          _isLoadingAmenity = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoadingAmenity = false);
    }
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: now,
      lastDate: now.add(const Duration(days: 60)),
    );
    if (picked != null) {
      HapticFeedback.selectionClick();
      setState(() {
        _selectedDate = picked;
        _selectedSlot = null;
      });
      _fetchBookedSlots(picked);
    }
  }

  Future<void> _fetchBookedSlots(DateTime date) async {
    setState(() => _isFetchingSlots = true);
    try {
      final profile = ref.read(userProfileProvider).value;
      final activeSocId = profile?.societyId ?? 'SOC-001';
      final repository = ref.read(amenityRepositoryProvider);

      final dateStr = '${date.day}/${date.month}/${date.year}';
      final booked = await repository.getBookedSlotsForDate(
          activeSocId, widget.amenityId, dateStr);

      if (mounted) {
        setState(() {
          _bookedSlots = booked.toSet();
          _isFetchingSlots = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isFetchingSlots = false);
      }
    }
  }

  Future<void> _bookSlot() async {
    final user = ref.read(currentUserProvider);
    final profile = ref.read(userProfileProvider).value;

    if (user == null || profile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('User session expired. Please log in again.')),
      );
      return;
    }

    if (_selectedSlot == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an available time slot.'),
          backgroundColor: Color(0xFFF59E0B),
        ),
      );
      return;
    }

    HapticFeedback.mediumImpact();
    final activeSocId = profile.societyId;
    final userName = profile.displayName.isNotEmpty
        ? profile.displayName
        : (profile.name.isNotEmpty ? profile.name : 'Resident');
    final flatNumber = profile.flatNumber;
    final phone = profile.phone.isNotEmpty
        ? profile.phone
        : (user.phoneNumber ?? '');
    final targetAmenityName = _amenityModel?.name ?? 'Society Amenity';

    final success =
        await ref.read(amenityControllerProvider.notifier).bookAmenity(
              societyId: activeSocId,
              amenityId: widget.amenityId,
              amenityName: targetAmenityName,
              uid: user.uid,
              userName: userName,
              flatNumber: flatNumber,
              phone: phone,
              selectedDate: _selectedDate,
              selectedSlot: _selectedSlot,
              guests: _guestCount,
            );

    if (success && mounted) {
      AmenityBookingPassSheet.show(
        context,
        amenityId: widget.amenityId,
        amenityName: targetAmenityName,
        flatNumber: flatNumber,
        residentName: userName,
        selectedDate: _selectedDate,
        selectedSlot: _selectedSlot!,
      );
    } else if (mounted) {
      final errorMsg = ref.read(amenityControllerProvider).errorMessage ??
          'Failed to book slot.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('❌ $errorMsg'), backgroundColor: AppColors.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final amenityName = _amenityModel?.name ?? 'Society Facility';
    final amenityTiming =
        _amenityModel?.timing ?? 'Open Daily: 06:00 AM - 10:00 PM';
    final maxCapacity = _amenityModel?.capacity ?? 10;
    final feeText = _amenityModel?.fee ?? 'Free';
    final controllerState = ref.watch(amenityControllerProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.amenities);
            }
          },
        ),
        title: Text(
          amenityName,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: const Color(0xFFE2E8F0), height: 1),
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: Color(0xFFE2E8F0))),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          child: SizedBox(
            height: 48,
            child: ElevatedButton(
              onPressed: (controllerState.isLoading || _selectedSlot == null)
                  ? null
                  : _bookSlot,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A8A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: controllerState.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.confirmation_number_outlined,
                            size: 18),
                        const SizedBox(width: 8),
                        Text(
                          _selectedSlot == null
                              ? 'Select a Slot to Continue'
                              : 'Confirm Booking • $_selectedSlot',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
      body: _isLoadingAmenity
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF1E3A8A)),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AmenityHeaderCard(
                    amenityName: amenityName,
                    feeText: feeText,
                    amenityTiming: amenityTiming,
                    maxCapacity: maxCapacity,
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  AmenityDateStrip(
                    selectedDate: _selectedDate,
                    onDateSelected: (date) {
                      setState(() {
                        _selectedDate = date;
                        _selectedSlot = null;
                      });
                      _fetchBookedSlots(date);
                    },
                    onPickCustomDate: _pickDate,
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  AmenitySlotPicker(
                    morningSlots: _morningSlots,
                    eveningSlots: _eveningSlots,
                    bookedSlots: _bookedSlots,
                    selectedSlot: _selectedSlot,
                    isFetchingSlots: _isFetchingSlots,
                    onSlotSelected: (slot) {
                      setState(() => _selectedSlot = slot);
                    },
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  AmenityGuestStepper(
                    guestCount: _guestCount,
                    maxCapacity: maxCapacity,
                    onGuestCountChanged: (count) {
                      setState(() => _guestCount = count);
                    },
                  ),
                  const SizedBox(height: AppSpacing.xl),
                ],
              ),
            ),
    );
  }
}
