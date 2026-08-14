import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/amenity_providers.dart';

class AmenityListScreen extends ConsumerStatefulWidget {
  const AmenityListScreen({super.key});

  @override
  ConsumerState<AmenityListScreen> createState() => _AmenityListScreenState();
}

class _AmenityListScreenState extends ConsumerState<AmenityListScreen> {
  static const Map<String, IconData> _iconMap = {
    'pool': Icons.pool_rounded,
    'gym': Icons.fitness_center_rounded,
    'clubhouse': Icons.meeting_room_rounded,
    'tennis': Icons.sports_tennis_rounded,
    'badminton': Icons.sports_rounded,
    'kids': Icons.child_care_rounded,
    'garden': Icons.park_rounded,
    'yoga': Icons.self_improvement_rounded,
  };

  static const Map<String, Color> _colorMap = {
    'pool': AppColors.info,
    'gym': AppColors.maintenance,
    'clubhouse': AppColors.amenity,
    'tennis': AppColors.success,
    'badminton': AppColors.warning,
    'kids': AppColors.complaint,
    'garden': AppColors.success,
    'yoga': AppColors.info,
  };

  @override
  Widget build(BuildContext context) {
    final amenitiesAsync = ref.watch(guardAmenitiesStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Amenities'),
        actions: [
          TextButton.icon(
            onPressed: () => context.go(AppRoutes.myBookings),
            icon: const Icon(Icons.calendar_month_rounded, size: 18),
            label: const Text('My Bookings'),
          ),
        ],
      ),
      body: amenitiesAsync.when(
        data: (amenities) {
          if (amenities.isEmpty) {
            return const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.sports_tennis_rounded, size: 56, color: AppColors.textDisabled),
                  SizedBox(height: AppSpacing.md),
                  Text('No amenities available', style: TextStyle(color: AppColors.textSecondary)),
                ],
              ),
            );
          }

          final bookingsAsync = ref.watch(guardAmenityBookingsStreamProvider);
          final bookingsList = bookingsAsync.value ?? [];
          final activeBookingsMap = <String, int>{};

          for (final bData in bookingsList) {
            final st = (bData['status'] as String? ?? '').toLowerCase();
            if (st == 'approved' || st == 'confirmed' || st == 'pending') {
              final aId = bData['amenityId'] as String? ?? '';
              if (aId.isNotEmpty) {
                activeBookingsMap[aId] = (activeBookingsMap[aId] ?? 0) + 1;
              }
            }
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: amenities.length,
            itemBuilder: (context, index) {
              final data = amenities[index];
              final docId = data['id'] as String? ?? '';
              final name = data['name'] as String? ?? 'Amenity';
              final iconKey = data['iconKey'] as String? ?? 'pool';
              final timing = data['timing'] as String? ?? data['timings'] as String? ?? '06:00 AM - 10:00 PM';
              final isAvailableStatus = data['status'] == 'Available';
              final isFacilityOpen = data['available'] == true || isAvailableStatus;

              final maxQuota = (data['capacity'] as num?)?.toInt() ??
                  (data['maxSlots'] as num?)?.toInt() ??
                  10;
              final docSlots = (data['availableSlots'] as num?)?.toInt();

              final bookedCount = activeBookingsMap[docId] ?? 0;
              final computedSlots = docSlots ?? (maxQuota - bookedCount);
              final remainingSlots = computedSlots < 0 ? 0 : computedSlots;
              final isFullyBooked = remainingSlots <= 0;
              final canBook = isFacilityOpen && !isFullyBooked;

              final feeLabel = data['fee'] as String? ??
                  (data['pricePerHour'] != null && (data['pricePerHour'] as num) > 0 ? '₹${data['pricePerHour']}/hr' : 'Free');

              final icon = _iconMap[iconKey] ?? Icons.sports_rounded;
              final color = _colorMap[iconKey] ?? AppColors.primary;

              return Container(
                margin: const EdgeInsets.only(bottom: AppSpacing.md),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  border: Border.all(color: AppColors.border),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(AppSpacing.md),
                  leading: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                    ),
                    child: Icon(icon, color: color, size: 24),
                  ),
                  title: Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Row(children: [
                        const Icon(Icons.access_time_rounded, size: 12, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text(timing, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(width: 8),
                        Text('• $feeLabel', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
                      ]),
                      const SizedBox(height: 4),
                      Text(
                        !isFacilityOpen
                            ? '● Facility Maintenance / Closed'
                            : isFullyBooked
                                ? '● Fully Booked / Sold Out (0 Left)'
                                : '● $remainingSlots Slots Available (Quota: $maxQuota)',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: canBook ? AppColors.success : AppColors.error,
                        ),
                      ),
                    ],
                  ),
                  trailing: canBook
                      ? ElevatedButton(
                          onPressed: () => context.go('${AppRoutes.amenities}/$docId'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            minimumSize: Size.zero,
                          ),
                          child: const Text('Book', style: TextStyle(fontSize: 12)),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: AppColors.error.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            !isFacilityOpen ? 'Closed' : 'Sold Out',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.error),
                          ),
                        ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
