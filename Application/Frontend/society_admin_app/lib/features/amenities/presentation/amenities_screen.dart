import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/facility_models.dart';

class AmenitiesScreen extends ConsumerStatefulWidget {
  const AmenitiesScreen({super.key});

  @override
  ConsumerState<AmenitiesScreen> createState() => _AmenitiesScreenState();
}

class _AmenitiesScreenState extends ConsumerState<AmenitiesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final society = ref.watch(activeSocietyProvider);
    final amenitiesAsync = ref.watch(amenitiesStreamProvider);
    final bookingsAsync = ref.watch(amenityBookingsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Amenities & Bookings'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryNavy,
          labelColor: AppColors.primaryNavy,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700),
          tabs: const [
            Tab(text: 'All Facilities'),
            Tab(text: 'Booking Requests'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Add Facility'),
        onPressed: () {
          if (society != null) {
            _showAddAmenityModal(context, ref, society.id);
          }
        },
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // TAB 1: ALL AMENITIES
          amenitiesAsync.when(
            loading: () => const LoadingStateWidget(message: 'Loading society amenities...'),
            error: (err, _) => ErrorStateWidget(message: err.toString()),
            data: (amenities) {
              if (amenities.isEmpty) {
                return EmptyStateWidget(
                  title: 'No Amenities Added',
                  description: 'Add clubhouses, swimming pools, gymnasiums, and sports courts.',
                  icon: Icons.pool_outlined,
                  actionLabel: 'Add Facility',
                  onAction: () {
                    if (society != null) _showAddAmenityModal(context, ref, society.id);
                  },
                );
              }

              return ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: amenities.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final item = amenities[index];
                  return AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.skyLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.apartment, color: AppColors.secondarySky, size: 26),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.name,
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${item.timings} • Max ${item.capacity} people',
                                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                              ),
                              if (item.bookingFee > 0) ...[
                                const SizedBox(height: 2),
                                Text(
                                  'Fee: ₹${item.bookingFee.toStringAsFixed(0)} / slot',
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.successEmerald),
                                ),
                              ],
                            ],
                          ),
                        ),
                        AppBadge(
                          label: item.isAvailable ? 'ACTIVE' : 'MAINTENANCE',
                          variant: item.isAvailable ? BadgeVariant.success : BadgeVariant.warning,
                          fontSize: 10,
                        ),
                      ],
                    ),
                  );
                },
              );
            },
          ),

          // TAB 2: BOOKINGS QUEUE
          bookingsAsync.when(
            loading: () => const LoadingStateWidget(message: 'Loading booking requests...'),
            error: (err, _) => ErrorStateWidget(message: err.toString()),
            data: (bookings) {
              if (bookings.isEmpty) {
                return const EmptyStateWidget(
                  title: 'No Pending Bookings',
                  description: 'All amenity slot reservations are up to date.',
                  icon: Icons.event_available_outlined,
                );
              }

              return ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: bookings.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final b = bookings[index];
                  return AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              b.amenityName,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                            ),
                            AppBadge(
                              label: b.status.toUpperCase(),
                              variant: b.status == 'approved'
                                  ? BadgeVariant.success
                                  : b.status == 'pending'
                                      ? BadgeVariant.warning
                                      : BadgeVariant.danger,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Reserved by ${b.residentName} (Flat ${b.flatNo})',
                          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                        ),
                        Text(
                          'Date: ${b.slotDate} • Slot: ${b.slotTime}',
                          style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                        ),
                        if (b.status == 'pending') ...[
                          const SizedBox(height: 14),
                          Row(
                            children: [
                              Expanded(
                                child: AppButton(
                                  label: 'Reject',
                                  variant: ButtonVariant.outline,
                                  onPressed: () async {
                                    if (society != null) {
                                      await ref.read(firestoreServiceProvider).updateAmenityBookingStatus(
                                            society.id,
                                            b.id,
                                            'rejected',
                                          );
                                    }
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: AppButton(
                                  label: 'Approve',
                                  variant: ButtonVariant.primary,
                                  onPressed: () async {
                                    if (society != null) {
                                      await ref.read(firestoreServiceProvider).updateAmenityBookingStatus(
                                            society.id,
                                            b.id,
                                            'approved',
                                          );
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }

  void _showAddAmenityModal(BuildContext context, WidgetRef ref, String societyId) {
    final nameCtrl = TextEditingController();
    final feeCtrl = TextEditingController();
    final capCtrl = TextEditingController();
    final timingCtrl = TextEditingController(text: '6:00 AM - 10:00 PM');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Facility / Amenity', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 16),
              AppTextField(controller: nameCtrl, label: 'Amenity Name', hintText: 'e.g. Banquet Hall / Swimming Pool'),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppTextField(controller: capCtrl, label: 'Capacity', hintText: '50', keyboardType: TextInputType.number),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(controller: feeCtrl, label: 'Booking Fee (₹)', hintText: '0 for free', keyboardType: TextInputType.number),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              AppTextField(controller: timingCtrl, label: 'Operating Timings', hintText: '6:00 AM - 10:00 PM'),
              const SizedBox(height: 20),
              AppButton(
                label: 'Save Facility',
                width: double.infinity,
                onPressed: () async {
                  if (nameCtrl.text.trim().isEmpty) return;
                  final amenity = AmenityModel(
                    id: '',
                    name: nameCtrl.text.trim(),
                    capacity: int.tryParse(capCtrl.text) ?? 0,
                    bookingFee: double.tryParse(feeCtrl.text) ?? 0.0,
                    timings: timingCtrl.text.trim(),
                  );
                  await ref.read(firestoreServiceProvider).createAmenity(societyId, amenity);
                  if (ctx.mounted) Navigator.of(ctx).pop();
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
