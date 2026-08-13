import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../domain/models/amenity_booking_model.dart';
import '../providers/amenity_providers.dart';

class MyBookingsScreen extends ConsumerWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final myBookingsAsync = ref.watch(myBookingsStreamProvider);

    if (user == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('My Amenity Bookings')),
        body: const Center(child: Text('Please log in to view your bookings.')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Amenity Bookings'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      backgroundColor: AppColors.background,
      body: myBookingsAsync.when(
        data: (bookings) {
          if (bookings.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.event_busy_rounded,
                      size: 56, color: AppColors.textDisabled),
                  const SizedBox(height: AppSpacing.md),
                  const Text('No bookings found',
                      style: TextStyle(color: AppColors.textSecondary)),
                ],
              ),
            );
          }

          final upcomingDocs =
              bookings.where((b) => b.isConfirmed || b.isPending).toList();
          final historyDocs =
              bookings.where((b) => b.isCancelled).toList();

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            children: [
              // Summary Strip
              Row(
                children: [
                  _SummaryChip(
                      label: '${upcomingDocs.length} Active',
                      color: AppColors.primary),
                  const SizedBox(width: AppSpacing.sm),
                  _SummaryChip(
                      label: '${historyDocs.length} Past/Cancelled',
                      color: AppColors.textSecondary),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Upcoming Section
              if (upcomingDocs.isNotEmpty) ...[
                const _SectionHeader(
                    title: 'ACTIVE BOOKINGS',
                    icon: Icons.event_available_rounded,
                    color: AppColors.primary),
                const SizedBox(height: AppSpacing.sm),
                ...upcomingDocs
                    .map((booking) => _LiveBookingCard(booking: booking)),
                const SizedBox(height: AppSpacing.lg),
              ],

              // Past Section
              if (historyDocs.isNotEmpty) ...[
                const _SectionHeader(
                    title: 'PAST & CANCELLED',
                    icon: Icons.history_rounded,
                    color: AppColors.textSecondary),
                const SizedBox(height: AppSpacing.sm),
                ...historyDocs
                    .map((booking) => _LiveBookingCard(booking: booking)),
              ],
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) =>
            Center(child: Text('Error loading bookings: $e')),
      ),
    );
  }
}

class _LiveBookingCard extends ConsumerWidget {
  final AmenityBookingModel booking;

  const _LiveBookingCard({required this.booking});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isConfirmed = booking.isConfirmed;
    final isCancelled = booking.isCancelled;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: isCancelled
                    ? AppColors.error.withValues(alpha: 0.1)
                    : AppColors.primary.withValues(alpha: 0.1),
                child: Icon(
                  Icons.pool_rounded,
                  size: 20,
                  color: isCancelled ? AppColors.error : AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(booking.amenityName,
                        style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary)),
                    const SizedBox(height: 2),
                    Text('${booking.date}  •  ${booking.timeSlot}',
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isCancelled
                      ? AppColors.error.withValues(alpha: 0.1)
                      : AppColors.success.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: Text(
                  booking.status.toUpperCase(),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isCancelled ? AppColors.error : AppColors.success,
                  ),
                ),
              ),
            ],
          ),
          if (isConfirmed) ...[
            const SizedBox(height: AppSpacing.md),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${booking.guests} Guest(s)',
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textSecondary)),
                OutlinedButton(
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Cancel Booking?'),
                        content: Text(
                            'Are you sure you want to cancel your booking for ${booking.amenityName} on ${booking.date} (${booking.timeSlot})?'),
                        actions: [
                          TextButton(
                              onPressed: () => Navigator.pop(ctx, false),
                              child: const Text('Keep Booking')),
                          ElevatedButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.error),
                            child: const Text('Cancel Booking'),
                          ),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      final user = ref.read(currentUserProvider);
                      final profile = ref.read(userProfileProvider).value;
                      final activeSocId = profile?.societyId ?? 'SOC-001';

                      if (user != null) {
                        final success = await ref
                            .read(amenityControllerProvider.notifier)
                            .cancelBooking(
                              societyId: activeSocId,
                              bookingId: booking.id,
                              uid: user.uid,
                            );

                        if (context.mounted) {
                          if (success) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content:
                                      Text('Booking cancelled successfully.'),
                                  backgroundColor: AppColors.error),
                            );
                          } else {
                            final errorMsg = ref
                                    .read(amenityControllerProvider)
                                    .errorMessage ??
                                'Failed to cancel booking.';
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                  content: Text(errorMsg),
                                  backgroundColor: AppColors.error),
                            );
                          }
                        }
                      }
                    }
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.error,
                    side: const BorderSide(color: AppColors.error),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child:
                      const Text('Cancel Booking', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _SummaryChip extends StatelessWidget {
  final String label;
  final Color color;
  const _SummaryChip({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(label,
          style: TextStyle(
              fontSize: 12, fontWeight: FontWeight.w600, color: color)),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;

  const _SectionHeader(
      {required this.title, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 6),
        Text(title,
            style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: color,
                letterSpacing: 0.8)),
      ],
    );
  }
}
