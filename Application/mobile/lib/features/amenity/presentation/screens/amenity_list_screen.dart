import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AmenityListScreen extends ConsumerStatefulWidget {
  const AmenityListScreen({super.key});

  @override
  ConsumerState<AmenityListScreen> createState() => _AmenityListScreenState();
}

class _AmenityListScreenState extends ConsumerState<AmenityListScreen> {
  bool _isSeeding = false;

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
        data: (snapshot) {
          if (snapshot.docs.isEmpty) {
            return Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.sports_tennis_rounded, size: 56, color: AppColors.textDisabled),
                const SizedBox(height: AppSpacing.md),
                const Text('No amenities available', style: TextStyle(color: AppColors.textSecondary)),
                const SizedBox(height: AppSpacing.xl),
                if (_isSeeding)
                  const CircularProgressIndicator()
                else
                  ElevatedButton.icon(
                    onPressed: () async {
                      setState(() => _isSeeding = true);
                      try {
                        final db = FirebaseFirestore.instance;
                        final batch = db.batch();
                        
                        final poolRef = db.collection('societies/SOC-001/amenities').doc();
                        batch.set(poolRef, {
                          'name': 'Swimming Pool',
                          'iconKey': 'pool',
                          'timing': '6:00 AM - 9:00 PM',
                          'available': true,
                          'availableSlots': 15,
                        });

                        final gymRef = db.collection('societies/SOC-001/amenities').doc();
                        batch.set(gymRef, {
                          'name': 'Fitness Center',
                          'iconKey': 'gym',
                          'timing': '5:00 AM - 11:00 PM',
                          'available': true,
                          'availableSlots': 30,
                        });

                        await batch.commit();
                      } catch (e) {
                        debugPrint('Error seeding: $e');
                      } finally {
                        if (mounted) setState(() => _isSeeding = false);
                      }
                    },
                    icon: const Icon(Icons.add_rounded),
                    label: const Text('Seed Amenities (Test)'),
                  ),
              ]),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            itemCount: snapshot.docs.length,
            itemBuilder: (context, index) {
              final doc = snapshot.docs[index];
              final data = doc.data() as Map<String, dynamic>;
              final name = data['name'] ?? 'Amenity';
              final iconKey = data['iconKey'] ?? 'pool';
              final timing = data['timing'] ?? 'N/A';
              final available = data['available'] ?? true;
              final slots = data['availableSlots'] ?? 0;

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
                    width: 48, height: 48,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                    ),
                    child: Icon(icon, color: color, size: 24),
                  ),
                  title: Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Row(children: [
                        const Icon(Icons.access_time_rounded, size: 12, color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text(timing, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ]),
                      const SizedBox(height: 4),
                      Text(
                        available ? '$slots slots available' : 'Currently unavailable',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: available ? AppColors.success : AppColors.error,
                        ),
                      ),
                    ],
                  ),
                  trailing: available
                      ? ElevatedButton(
                          onPressed: () => context.go('${AppRoutes.amenities}/${doc.id}'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            minimumSize: Size.zero,
                          ),
                          child: const Text('Book', style: TextStyle(fontSize: 12)),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: AppColors.error.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: const Text('Closed', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.error)),
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
