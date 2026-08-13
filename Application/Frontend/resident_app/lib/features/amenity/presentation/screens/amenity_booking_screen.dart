import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../domain/models/amenity_model.dart';
import '../providers/amenity_providers.dart';

class AmenityBookingScreen extends ConsumerStatefulWidget {
  final String amenityId;
  const AmenityBookingScreen({super.key, required this.amenityId});

  @override
  ConsumerState<AmenityBookingScreen> createState() =>
      _AmenityBookingScreenState();
}

class _AmenityBookingScreenState extends ConsumerState<AmenityBookingScreen> {
  DateTime? _selectedDate;
  String? _selectedSlot;
  int _guestCount = 1;

  AmenityModel? _amenityModel;
  bool _isLoadingAmenity = true;

  final List<String> _slots = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM'
  ];
  Set<String> _bookedSlots = {};
  bool _isFetchingSlots = false;

  @override
  void initState() {
    super.initState();
    _fetchAmenityProfile();
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
      initialDate: now,
      firstDate: now,
      lastDate: now.add(const Duration(days: 30)),
    );
    if (picked != null) {
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
    } catch (e) {
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

    final activeSocId = profile.societyId;
    final userName = profile.displayName.isNotEmpty
        ? profile.displayName
        : (profile.name.isNotEmpty ? profile.name : 'Resident');
    final flatNumber = profile.flatNumber;
    final phone = profile.email;
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
      _showSuccessDialog(targetAmenityName);
    } else if (mounted) {
      final errorMsg = ref.read(amenityControllerProvider).errorMessage ??
          'Failed to book slot.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('❌ $errorMsg'), backgroundColor: AppColors.error),
      );
    }
  }

  void _showSuccessDialog(String targetAmenityName) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.xl)),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.check_circle_rounded,
              color: AppColors.success, size: 56),
          const SizedBox(height: AppSpacing.md),
          const Text('Booking Confirmed!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text(
              'Your slot for $targetAmenityName at $_selectedSlot has been booked.',
              style: const TextStyle(color: AppColors.textSecondary),
              textAlign: TextAlign.center),
        ]),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.of(dialogCtx).pop();
              if (mounted) {
                context.go(AppRoutes.myBookings);
              }
            },
            child: const Text('View My Bookings'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final amenityName = _amenityModel?.name ?? 'Society Facility';
    final amenityTiming = _amenityModel?.timing ?? 'Open Daily: 06:00 AM - 10:00 PM';
    final maxCapacity = _amenityModel?.capacity ?? 10;
    final feeText = _amenityModel?.fee ?? 'Free';
    final controllerState = ref.watch(amenityControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: Text(amenityName)),
      body: _isLoadingAmenity
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.pagePadding),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Amenity Header Banner
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF06B6D4), Color(0xFF0891B2)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(AppRadius.xl),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(amenityName,
                            style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Colors.white)),
                        const SizedBox(height: 4),
                        Row(children: [
                          const Icon(Icons.access_time_rounded,
                              size: 14, color: Colors.white70),
                          const SizedBox(width: 4),
                          Text(amenityTiming,
                              style: const TextStyle(
                                  fontSize: 12, color: Colors.white70)),
                        ]),
                        const SizedBox(height: 8),
                        Row(children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius:
                                  BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text('Fee: $feeText',
                                style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white)),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius:
                                  BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text('Quota: $maxCapacity Slots/Hr',
                                style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white)),
                          ),
                        ]),
                      ],
                    ),
                  ),

                  const SizedBox(height: AppSpacing.lg),

                  // Date Picker Section
                  const Text('Select Date',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary)),
                  const SizedBox(height: AppSpacing.sm),
                  InkWell(
                    onTap: _pickDate,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    child: Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded,
                              color: AppColors.primary, size: 20),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Text(
                              _selectedDate == null
                                  ? 'Tap to select booking date'
                                  : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                              style: TextStyle(
                                color: _selectedDate == null
                                    ? AppColors.textSecondary
                                    : AppColors.textPrimary,
                                fontWeight: _selectedDate == null
                                    ? FontWeight.normal
                                    : FontWeight.w600,
                              ),
                            ),
                          ),
                          const Icon(Icons.chevron_right_rounded,
                              color: AppColors.textSecondary),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.lg),

                  // Slot Selection Section
                  if (_selectedDate != null) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Select Time Slot',
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary)),
                        if (_isFetchingSlots)
                          const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(strokeWidth: 2)),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.sm,
                      children: _slots.map((slot) {
                        final isBooked = _bookedSlots.contains(slot);
                        final isSelected = _selectedSlot == slot;

                        return ChoiceChip(
                          label: Text(slot),
                          selected: isSelected,
                          onSelected: isBooked
                              ? null
                              : (selected) {
                                  setState(() {
                                    _selectedSlot = selected ? slot : null;
                                  });
                                },
                          selectedColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected
                                ? Colors.white
                                : (isBooked
                                    ? AppColors.textDisabled
                                    : AppColors.textPrimary),
                            fontWeight: isSelected
                                ? FontWeight.w700
                                : FontWeight.normal,
                          ),
                          backgroundColor: Colors.white,
                          disabledColor: AppColors.background,
                          shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(AppRadius.full),
                            side: BorderSide(
                              color: isSelected
                                  ? AppColors.primary
                                  : (isBooked
                                      ? AppColors.border
                                      : AppColors.border),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                  ],

                  // Guest Counter
                  const Text('Number of Guests',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary)),
                  const SizedBox(height: AppSpacing.sm),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Guests',
                            style: TextStyle(color: AppColors.textSecondary)),
                        Row(
                          children: [
                            IconButton(
                              onPressed: _guestCount > 1
                                  ? () => setState(() => _guestCount--)
                                  : null,
                              icon: const Icon(Icons.remove_circle_outline_rounded),
                              color: AppColors.primary,
                            ),
                            Text('$_guestCount',
                                style: const TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w700)),
                            IconButton(
                              onPressed: _guestCount < maxCapacity
                                  ? () => setState(() => _guestCount++)
                                  : null,
                              icon: const Icon(Icons.add_circle_outline_rounded),
                              color: AppColors.primary,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: AppSpacing.xl),

                  // Confirm Booking Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: controllerState.isLoading ? null : _bookSlot,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppRadius.lg)),
                      ),
                      child: controllerState.isLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white),
                            )
                          : const Text('Confirm Booking',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
