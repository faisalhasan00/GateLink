import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../providers/amenity_providers.dart';

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
    final amenitiesAsync = ref.watch(amenitiesStreamProvider);
    final myBookingsAsync = ref.watch(myBookingsStreamProvider);
    final controllerState = ref.watch(amenityControllerProvider);

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
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.sports_tennis_rounded,
                      size: 56, color: AppColors.textDisabled),
                  const SizedBox(height: AppSpacing.md),
                  const Text('No amenities available',
                      style: TextStyle(color: AppColors.textSecondary)),
                  const SizedBox(height: AppSpacing.xl),
                  if (controllerState.isLoading)
                    const CircularProgressIndicator()
                  else
                    ElevatedButton.icon(
                      onPressed: () async {
                        final profile = ref.read(userProfileProvider).value;
                        final activeSocId = profile?.societyId ?? 'SOC-001';
                        await ref
                            .read(amenityControllerProvider.notifier)
                            .seedDefaultAmenities(activeSocId);
                      },
                      icon: const Icon(Icons.add_rounded),
                      label: const Text('Seed Full Society Amenities'),
                    ),
                ],
              ),
            );
          }

          final myBookingsList = myBookingsAsync.value ?? [];
          final activeBookingsMap = <String, int>{};
          for (final booking in myBookingsList) {
            if (booking.isConfirmed || booking.isPending) {
              if (booking.amenityId.isNotEmpty) {
                activeBookingsMap[booking.amenityId] =
                    (activeBookingsMap[booking.amenityId] ?? 0) + 1;
              }
            }
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: amenities.length,
            itemBuilder: (context, index) {
              final amenity = amenities[index];
              final isFacilityOpen = amenity.available;

              final bookedCount = activeBookingsMap[amenity.id] ?? 0;
              final computedSlots = amenity.availableSlots != null
                  ? amenity.availableSlots!
                  : (amenity.capacity - bookedCount);
              final remainingSlots = computedSlots < 0 ? 0 : computedSlots;
              final isFullyBooked = remainingSlots <= 0;
              final canBook = isFacilityOpen && !isFullyBooked;

              final icon = _iconMap[amenity.iconKey] ?? Icons.sports_rounded;
              final color = _colorMap[amenity.iconKey] ?? AppColors.primary;

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
                  title: Text(amenity.name,
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Row(children: [
                        const Icon(Icons.access_time_rounded,
                            size: 12, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text(amenity.timing,
                            style: const TextStyle(
                                fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(width: 8),
                        Text('• ${amenity.fee}',
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary)),
                      ]),
                      const SizedBox(height: 4),
                      Text(
                        !isFacilityOpen
                            ? '● Facility Maintenance / Closed'
                            : isFullyBooked
                                ? '● Fully Booked / Sold Out (0 Left)'
                                : '● $remainingSlots Slots Available (Quota: ${amenity.capacity})',
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
                          onPressed: () =>
                              context.go('${AppRoutes.amenities}/${amenity.id}'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 8),
                            minimumSize: Size.zero,
                          ),
                          child: const Text('Book',
                              style: TextStyle(fontSize: 12)),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: AppColors.error.withValues(alpha: 0.1),
                            borderRadius:
                                BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(
                            !isFacilityOpen ? 'Closed' : 'Sold Out',
                            style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.error),
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
