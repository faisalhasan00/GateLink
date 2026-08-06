import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';

class AmenityBookingScreen extends ConsumerStatefulWidget {
  final String amenityId;
  const AmenityBookingScreen({super.key, required this.amenityId});

  @override
  ConsumerState<AmenityBookingScreen> createState() => _AmenityBookingScreenState();
}

class _AmenityBookingScreenState extends ConsumerState<AmenityBookingScreen> {
  DateTime? _selectedDate;
  String? _selectedSlot;
  int _guestCount = 1;
  bool _isLoading = false;

  Map<String, dynamic>? _amenityDocData;
  bool _isLoadingAmenity = true;

  final List<String> _slots = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
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
      final activeSocId = profile?['societyId'] as String? ?? 'SOC-001';
      final db = ref.read(firestoreProvider);
      final docSnap = await db.collection('societies/$activeSocId/amenities').doc(widget.amenityId).get();
      if (docSnap.exists && mounted) {
        setState(() {
          _amenityDocData = docSnap.data();
          _isLoadingAmenity = false;
        });
      } else if (mounted) {
        setState(() => _isLoadingAmenity = false);
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
        _selectedSlot = null; // Reset selected slot when date changes
      });
      _fetchBookedSlots(picked);
    }
  }

  Future<void> _fetchBookedSlots(DateTime date) async {
    setState(() => _isFetchingSlots = true);
    try {
      final firestoreService = ref.read(firestoreServiceProvider);
      if (firestoreService == null) return;
      
      final dateStr = '${date.day}/${date.month}/${date.year}';
      final booked = await firestoreService.getBookedSlotsForDate(widget.amenityId, dateStr);
      
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
    if (_selectedDate == null || _selectedSlot == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select both a date and a time slot')),
      );
      return;
    }

    setState(() => _isLoading = true);
    
    try {
      final firestoreService = ref.read(firestoreServiceProvider);
      final user = ref.read(currentUserProvider);
      final profile = ref.read(userProfileProvider).value;

      if (firestoreService == null || user == null) {
        throw Exception('Not logged in');
      }

      final userName = profile?['name'] ?? 'Unknown User';
      final flatNumber = profile?['flatNumber'] as String? ?? '';
      final phone = profile?['phone'] as String? ?? '';
      final targetAmenityName = _amenityDocData?['name'] as String? ?? 'Society Amenity';

      await firestoreService.bookAmenity(
        amenityId: widget.amenityId,
        amenityName: targetAmenityName,
        uid: user.uid,
        userName: userName,
        flatNumber: flatNumber,
        phone: phone,
        date: '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
        timeSlot: _selectedSlot!,
        guests: _guestCount,
      );

      if (!mounted) return;
      setState(() => _isLoading = false);
      _showSuccessDialog(targetAmenityName);
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        final cleanErr = e.toString().replaceAll('Exception: ', '');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ $cleanErr'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _showSuccessDialog(String targetAmenityName) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 56),
          const SizedBox(height: AppSpacing.md),
          const Text('Booking Confirmed!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text('Your slot for $targetAmenityName at $_selectedSlot has been booked.',
              style: const TextStyle(color: AppColors.textSecondary), textAlign: TextAlign.center),
        ]),
        actions: [
          ElevatedButton(
            onPressed: () { Navigator.pop(context); context.go(AppRoutes.myBookings); },
            child: const Text('View My Bookings'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final amenityName = _amenityDocData?['name'] as String? ?? 'Society Facility';
    final amenityTiming = _amenityDocData?['timing'] as String? ?? _amenityDocData?['timings'] as String? ?? 'Open Daily: 06:00 AM - 10:00 PM';
    final maxCapacity = (_amenityDocData?['capacity'] as num?)?.toInt() ?? (_amenityDocData?['maxSlots'] as num?)?.toInt() ?? 10;
    final feeText = _amenityDocData?['fee'] as String? ?? 'Free';

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
                  // Amenity header
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF06B6D4), Color(0xFF0891B2)],
                        begin: Alignment.topLeft, end: Alignment.bottomRight),
                      borderRadius: BorderRadius.circular(AppRadius.xl),
                    ),
                    child: Row(children: [
                      Container(width: 52, height: 52,
                        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), shape: BoxShape.circle),
                        child: const Icon(Icons.sports_tennis_rounded, color: Colors.white, size: 28)),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(amenityName, style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800)),
                          const SizedBox(height: 2),
                          Text('$amenityTiming • $feeText', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                          Text('Quota: $maxCapacity Slots / Session', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                        ]),
                      ),
                    ]),
                  ),
            const SizedBox(height: AppSpacing.xl),

            // Date Picker
            const Text('Select Date', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.sm),
            GestureDetector(
              onTap: _pickDate,
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppRadius.lg), border: Border.all(color: AppColors.border)),
                child: Row(children: [
                  const Icon(Icons.calendar_today_rounded, color: AppColors.primary, size: 20),
                  const SizedBox(width: AppSpacing.sm),
                  Text(
                    _selectedDate == null ? 'Select booking date' : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                    style: TextStyle(fontSize: 14, color: _selectedDate == null ? AppColors.textSecondary : AppColors.textPrimary)),
                  const Spacer(),
                  const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textSecondary),
                ]),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Time slots
            const Text('Select Time Slot', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.sm),
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: _slots.map((slot) {
                final isBooked = _bookedSlots.contains(slot);
                final isSelected = _selectedSlot == slot;
                return GestureDetector(
                  onTap: isBooked ? null : () => setState(() => _selectedSlot = slot),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: isBooked ? AppColors.gray100 : isSelected ? AppColors.primary : Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(
                        color: isBooked ? AppColors.border : isSelected ? AppColors.primary : AppColors.border,
                        width: isSelected ? 1.5 : 1,
                      ),
                    ),
                    child: Text(slot,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                        color: isBooked ? AppColors.textDisabled : isSelected ? Colors.white : AppColors.textPrimary,
                      )),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Guest count
            const Text('Number of Guests', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.sm),
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppRadius.lg), border: Border.all(color: AppColors.border)),
              child: Row(children: [
                const Icon(Icons.group_rounded, color: AppColors.textSecondary, size: 20),
                const SizedBox(width: AppSpacing.sm),
                const Text('Guests', style: TextStyle(fontSize: 14, color: AppColors.textPrimary)),
                const Spacer(),
                IconButton(
                  onPressed: _guestCount > 1 ? () => setState(() => _guestCount--) : null,
                  icon: Icon(Icons.remove_circle_outline_rounded,
                    color: _guestCount > 1 ? AppColors.primary : AppColors.textDisabled)),
                Text('$_guestCount', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                IconButton(
                  onPressed: _guestCount < 10 ? () => setState(() => _guestCount++) : null,
                  icon: Icon(Icons.add_circle_outline_rounded,
                    color: _guestCount < 10 ? AppColors.primary : AppColors.textDisabled)),
              ]),
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton(
              onPressed: _isLoading || _selectedSlot == null || _selectedDate == null ? null : _bookSlot,
              child: _isLoading
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Text('Confirm Booking'),
            ),
          ],
        ),
      ),
    );
  }
}
