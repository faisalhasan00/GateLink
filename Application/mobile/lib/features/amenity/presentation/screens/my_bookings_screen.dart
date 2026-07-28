import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';

class MyBookingsScreen extends ConsumerWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final firestoreService = ref.watch(firestoreServiceProvider);

    if (user == null || firestoreService == null) {
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
      body: StreamBuilder(
        stream: firestoreService.myBookingsStream(user.uid),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error loading bookings: ${snapshot.error}'));
          }

          final docs = snapshot.data?.docs ?? [];
          if (docs.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.event_busy_rounded, size: 56, color: AppColors.textDisabled),
                  const SizedBox(height: AppSpacing.md),
                  const Text('No bookings found', style: TextStyle(color: AppColors.textSecondary)),
                ],
              ),
            );
          }

          final upcomingDocs = docs.where((d) {
            final data = d.data() as Map<String, dynamic>;
            final status = data['status'] ?? '';
            return status == 'confirmed';
          }).toList();

          final historyDocs = docs.where((d) {
            final data = d.data() as Map<String, dynamic>;
            final status = data['status'] ?? '';
            return status != 'confirmed';
          }).toList();

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            children: [
              // Summary Strip
              Row(
                children: [
                  _SummaryChip(label: '${upcomingDocs.length} Active', color: AppColors.primary),
                  const SizedBox(width: AppSpacing.sm),
                  _SummaryChip(label: '${historyDocs.length} Past/Cancelled', color: AppColors.textSecondary),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Upcoming Section
              if (upcomingDocs.isNotEmpty) ...[
                const _SectionHeader(title: 'ACTIVE BOOKINGS', icon: Icons.event_available_rounded, color: AppColors.primary),
                const SizedBox(height: AppSpacing.sm),
                ...upcomingDocs.map((doc) => _LiveBookingCard(doc: doc, ref: ref)),
                const SizedBox(height: AppSpacing.lg),
              ],

              // Past Section
              if (historyDocs.isNotEmpty) ...[
                const _SectionHeader(title: 'PAST & CANCELLED', icon: Icons.history_rounded, color: AppColors.textSecondary),
                const SizedBox(height: AppSpacing.sm),
                ...historyDocs.map((doc) => _LiveBookingCard(doc: doc, ref: ref)),
              ],
            ],
          );
        },
      ),
    );
  }
}

class _LiveBookingCard extends StatelessWidget {
  final dynamic doc;
  final WidgetRef ref;

  const _LiveBookingCard({required this.doc, required this.ref});

  @override
  Widget build(BuildContext context) {
    final data = doc.data() as Map<String, dynamic>;
    final amenityName = data['amenityName'] ?? 'Amenity';
    final date = data['date'] ?? '';
    final timeSlot = data['timeSlot'] ?? '';
    final status = data['status'] ?? 'confirmed';
    final guests = data['guests'] ?? 1;

    final isConfirmed = status == 'confirmed';
    final isCancelled = status == 'cancelled';

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
                    Text(amenityName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    const SizedBox(height: 2),
                    Text('$date  •  $timeSlot', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isCancelled
                      ? AppColors.error.withValues(alpha: 0.1)
                      : AppColors.success.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: Text(
                  status.toUpperCase(),
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
                Text('$guests Guest(s)', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                OutlinedButton(
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Cancel Booking?'),
                        content: Text('Are you sure you want to cancel your booking for $amenityName on $date ($timeSlot)?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Keep Booking')),
                          ElevatedButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                            child: const Text('Cancel Booking'),
                          ),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      final svc = ref.read(firestoreServiceProvider);
                      final user = ref.read(currentUserProvider);
                      if (svc != null && user != null) {
                        await svc.cancelAmenityBooking(doc.id, user.uid);
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Booking cancelled successfully.'), backgroundColor: AppColors.error),
                          );
                        }
                      }
                    }
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.error,
                    side: const BorderSide(color: AppColors.error),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: const Text('Cancel Booking', style: TextStyle(fontSize: 12)),
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
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 6),
        Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: color, letterSpacing: 0.8)),
      ],
    );
  }
}
