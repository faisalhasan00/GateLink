import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class MyBookingsScreen extends StatelessWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final upcomingBookings = [
      _Booking(
        amenity: 'Swimming Pool',
        date: 'Today, 24 Jul 2026',
        time: '6:00 PM – 7:00 PM',
        status: 'confirmed',
        guests: 2,
        icon: Icons.pool_rounded,
        color: AppColors.info,
      ),
      _Booking(
        amenity: 'Tennis Court',
        date: 'Tomorrow, 25 Jul 2026',
        time: '7:00 AM – 8:00 AM',
        status: 'confirmed',
        guests: 1,
        icon: Icons.sports_tennis_rounded,
        color: AppColors.success,
      ),
    ];

    final pastBookings = [
      _Booking(
        amenity: 'Clubhouse Hall',
        date: '15 Jul 2026',
        time: '4:00 PM – 8:00 PM',
        status: 'completed',
        guests: 15,
        icon: Icons.celebration_rounded,
        color: AppColors.amenity,
      ),
      _Booking(
        amenity: 'Badminton Court',
        date: '10 Jul 2026',
        time: '8:00 AM – 9:00 AM',
        status: 'completed',
        guests: 2,
        icon: Icons.sports_rounded,
        color: AppColors.visitor,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Amenity Bookings'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      backgroundColor: AppColors.background,
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        children: [
          // Summary Strip
          Row(
            children: [
              _SummaryChip(label: '${upcomingBookings.length} Upcoming', color: AppColors.primary),
              const SizedBox(width: AppSpacing.sm),
              _SummaryChip(label: '${pastBookings.length} Completed', color: AppColors.textSecondary),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Upcoming Section
          if (upcomingBookings.isNotEmpty) ...[
            const _SectionHeader(title: 'UPCOMING', icon: Icons.event_available_rounded, color: AppColors.primary),
            const SizedBox(height: AppSpacing.sm),
            ...upcomingBookings.map((b) => _BookingCard(booking: b, context: context)),
            const SizedBox(height: AppSpacing.lg),
          ],

          // Past Section
          if (pastBookings.isNotEmpty) ...[
            const _SectionHeader(title: 'PAST BOOKINGS', icon: Icons.history_rounded, color: AppColors.textSecondary),
            const SizedBox(height: AppSpacing.sm),
            ...pastBookings.map((b) => _BookingCard(booking: b, context: context)),
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
      child: Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color)),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  const _SectionHeader({required this.title, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 6),
        Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color, letterSpacing: 1.0)),
      ],
    );
  }
}

class _BookingCard extends StatelessWidget {
  final _Booking booking;
  final BuildContext context;
  const _BookingCard({required this.booking, required this.context});

  @override
  Widget build(BuildContext ctx) {
    final isCompleted = booking.status == 'completed';
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                // Amenity Icon
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: (isCompleted ? AppColors.gray400 : booking.color).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Icon(
                    booking.icon,
                    color: isCompleted ? AppColors.gray400 : booking.color,
                    size: 24,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              booking.amenity,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: isCompleted ? AppColors.textSecondary : AppColors.textPrimary,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: isCompleted ? AppColors.gray100 : AppColors.successSurface,
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text(
                              isCompleted ? 'DONE' : 'CONFIRMED',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color: isCompleted ? AppColors.gray600 : AppColors.success,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 12, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Text(booking.date, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(Icons.access_time_rounded, size: 12, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Text(booking.time, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          const Spacer(),
                          const Icon(Icons.people_rounded, size: 12, color: AppColors.textSecondary),
                          const SizedBox(width: 3),
                          Text(
                            '${booking.guests} guest${booking.guests > 1 ? 's' : ''}',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Cancel button for upcoming
          if (!isCompleted) ...[
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, size: 13, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  const Expanded(
                    child: Text(
                      'Free cancellation up to 2 hours before slot',
                      style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      ScaffoldMessenger.of(ctx).showSnackBar(
                        const SnackBar(
                          content: Text('Booking cancelled'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.error,
                      minimumSize: const Size(80, 30),
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                    child: const Text('Cancel'),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _Booking {
  final String amenity, date, time, status;
  final int guests;
  final IconData icon;
  final Color color;
  const _Booking({
    required this.amenity,
    required this.date,
    required this.time,
    required this.status,
    required this.guests,
    required this.icon,
    required this.color,
  });
}
