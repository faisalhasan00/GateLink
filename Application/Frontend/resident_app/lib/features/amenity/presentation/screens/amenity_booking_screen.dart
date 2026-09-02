import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/amenity_model.dart';
import '../../providers/amenity_providers.dart';
import '../controllers/amenity_controller.dart';

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
      _showBookingPassBottomSheet(
        amenityName: targetAmenityName,
        flatNumber: flatNumber,
        residentName: userName,
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

  void _showBookingPassBottomSheet({
    required String amenityName,
    required String flatNumber,
    required String residentName,
  }) {
    final formattedDate =
        DateFormat('EEE, dd MMM yyyy').format(_selectedDate);
    final passCode =
        'AMN-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
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
                    data: 'GATELINK:AMENITY:$passCode:${widget.amenityId}',
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
                      _buildPassDetail('Slot', _selectedSlot ?? ''),
                      _buildPassDetail('Unit', 'Flat $flatNumber ($residentName)'),
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
                  Navigator.pop(ctx);
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
                        const Icon(Icons.confirmation_number_outlined, size: 18),
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
                  // ── 1. AMENITY HEADER CARD ──────────────────────────────
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1E3A8A), Color(0xFF0EA5E9)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF0EA5E9).withValues(alpha: 0.25),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              amenityName,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                feeText.toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.schedule_rounded,
                                size: 14, color: Colors.white70),
                            const SizedBox(width: 4),
                            Text(
                              amenityTiming,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.white70,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'Max Capacity: $maxCapacity Slots/Hr',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // ── 2. 7-DAY INTERACTIVE DATE STRIP ───────────────────────
                  Row(
                    children: [
                      const Text(
                        'SELECT BOOKING DATE',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: _pickDate,
                        tooltip: 'Choose Other Date',
                        icon: const Icon(
                          Icons.calendar_month_rounded,
                          size: 20,
                          color: Color(0xFF1E3A8A),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 72,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: 7,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final date = DateTime.now().add(Duration(days: index));
                        final isSelected = date.year == _selectedDate.year &&
                            date.month == _selectedDate.month &&
                            date.day == _selectedDate.day;

                        final dayName = index == 0
                            ? 'TODAY'
                            : (index == 1
                                ? 'TMRW'
                                : DateFormat('EEE').format(date).toUpperCase());
                        final dayNumber = DateFormat('dd').format(date);
                        final monthName = DateFormat('MMM').format(date);

                        return InkWell(
                          onTap: () {
                            HapticFeedback.selectionClick();
                            setState(() {
                              _selectedDate = date;
                              _selectedSlot = null;
                            });
                            _fetchBookedSlots(date);
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            width: 58,
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? const Color(0xFF1E3A8A)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected
                                    ? const Color(0xFF1E3A8A)
                                    : const Color(0xFFE2E8F0),
                                width: isSelected ? 1.5 : 1.0,
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: const Color(0xFF1E3A8A)
                                            .withValues(alpha: 0.25),
                                        blurRadius: 6,
                                        offset: const Offset(0, 2),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  dayName,
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w800,
                                    color: isSelected
                                        ? const Color(0xFF93C5FD)
                                        : const Color(0xFF64748B),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  dayNumber,
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: isSelected
                                        ? Colors.white
                                        : const Color(0xFF0F172A),
                                  ),
                                ),
                                Text(
                                  monthName,
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    color: isSelected
                                        ? Colors.white70
                                        : const Color(0xFF94A3B8),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // ── 3. TIME SLOT SELECTION (MORNING & EVENING) ─────────────
                  Row(
                    children: [
                      const Text(
                        'AVAILABLE TIME SLOTS',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (_isFetchingSlots)
                        const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Color(0xFF1E3A8A),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Morning Slots
                  _buildSlotSectionHeader('🌅 Morning Slots (6 AM - 11 AM)'),
                  const SizedBox(height: 8),
                  _buildSlotsGrid(_morningSlots),
                  const SizedBox(height: 16),

                  // Evening Slots
                  _buildSlotSectionHeader('🌆 Evening Slots (4 PM - 9 PM)'),
                  const SizedBox(height: 8),
                  _buildSlotsGrid(_eveningSlots),
                  const SizedBox(height: AppSpacing.lg),

                  // ── 4. GUEST / PERSONS COUNT ───────────────────────────────
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.group_outlined,
                            color: Color(0xFF1E3A8A),
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Number of Persons',
                              style: TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            Text(
                              'Max allowed: $maxCapacity guests',
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                        const Spacer(),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFFCBD5E1)),
                          ),
                          child: Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove, size: 16),
                                onPressed: _guestCount > 1
                                    ? () {
                                        HapticFeedback.selectionClick();
                                        setState(() => _guestCount--);
                                      }
                                    : null,
                              ),
                              Text(
                                '$_guestCount',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add, size: 16),
                                onPressed: _guestCount < maxCapacity
                                    ? () {
                                        HapticFeedback.selectionClick();
                                        setState(() => _guestCount++);
                                      }
                                    : null,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                ],
              ),
            ),
    );
  }

  Widget _buildSlotSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w700,
        color: Color(0xFF475569),
      ),
    );
  }

  Widget _buildSlotsGrid(List<String> slots) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: slots.map((slot) {
        final isBooked = _bookedSlots.contains(slot);
        final isSelected = _selectedSlot == slot;

        return InkWell(
          onTap: isBooked
              ? null
              : () {
                  HapticFeedback.selectionClick();
                  setState(() {
                    _selectedSlot = isSelected ? null : slot;
                  });
                },
          borderRadius: BorderRadius.circular(10),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected
                  ? const Color(0xFF1E3A8A)
                  : (isBooked ? const Color(0xFFF1F5F9) : Colors.white),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected
                    ? const Color(0xFF1E3A8A)
                    : (isBooked
                        ? const Color(0xFFE2E8F0)
                        : const Color(0xFFCBD5E1)),
                width: isSelected ? 1.5 : 1.0,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (isSelected) ...[
                  const Icon(Icons.check_circle_rounded,
                      size: 14, color: Colors.white),
                  const SizedBox(width: 6),
                ] else if (isBooked) ...[
                  const Icon(Icons.block_rounded,
                      size: 13, color: Color(0xFF94A3B8)),
                  const SizedBox(width: 6),
                ],
                Text(
                  slot,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                    decoration:
                        isBooked ? TextDecoration.lineThrough : null,
                    color: isSelected
                        ? Colors.white
                        : (isBooked
                            ? const Color(0xFF94A3B8)
                            : const Color(0xFF0F172A)),
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
