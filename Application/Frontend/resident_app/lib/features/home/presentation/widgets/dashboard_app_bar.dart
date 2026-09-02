import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class DashboardAppBar extends ConsumerWidget {
  const DashboardAppBar({super.key});

  Map<String, dynamic> _getTimeGreetingData() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) {
      return {'greeting': 'Good Morning', 'icon': Icons.wb_sunny_rounded, 'color': const Color(0xFFF59E0B)};
    } else if (hour >= 12 && hour < 17) {
      return {'greeting': 'Good Afternoon', 'icon': Icons.wb_cloudy_rounded, 'color': const Color(0xFF0EA5E9)};
    } else if (hour >= 17 && hour < 21) {
      return {'greeting': 'Good Evening', 'icon': Icons.wb_twilight_rounded, 'color': const Color(0xFFF97316)};
    } else {
      return {'greeting': 'Good Night', 'icon': Icons.nightlight_round, 'color': const Color(0xFF6366F1)};
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);
    final user = ref.watch(currentUserProvider);
    final profile = profileAsync.value;

    final String residentName = profile?.name.isNotEmpty == true
        ? profile!.name
        : (profile?.displayName.isNotEmpty == true
            ? profile!.displayName
            : (user?.displayName ??
                (user?.email?.split('@').first ?? 'Resident')));

    final String societyName = profile?.displaySocietyName ?? '';
    final String flatNumber = profile?.displayFlatNumber ?? '';
    final greetingData = _getTimeGreetingData();
    final String greeting = greetingData['greeting'] as String;
    final IconData greetingIcon = greetingData['icon'] as IconData;
    final Color greetingColor = greetingData['color'] as Color;

    return SliverAppBar(
      pinned: true,
      floating: false,
      snap: false,
      backgroundColor: Colors.white,
      elevation: 0,
      titleSpacing: AppSpacing.pagePadding,
      title: Row(
        children: [
          // Resident Avatar with soft border & profile tap
          AppAvatar(
            imageUrl: profile?.photoUrl,
            name: residentName,
            size: AppAvatarSize.sm,
            showBorder: true,
            borderColor: const Color(0xFFE2E8F0),
            onTap: () => context.push(AppRoutes.profile),
          ),
          const SizedBox(width: 12),

          // Greeting & Location
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(greetingIcon, size: 12, color: greetingColor),
                    const SizedBox(width: 4),
                    Text(
                      greeting,
                      style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 1),
                Text(
                  residentName,
                  style: const TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    letterSpacing: -0.3,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (societyName.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: const Color(0xFFE2E8F0), width: 0.8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.apartment_rounded,
                                size: 10,
                                color: Color(0xFF1E3A8A),
                              ),
                              const SizedBox(width: 3),
                              Flexible(
                                child: Text(
                                  flatNumber.isNotEmpty
                                      ? '$societyName • Flat $flatNumber'
                                      : societyName,
                                  style: const TextStyle(
                                    fontSize: 10.5,
                                    color: Color(0xFF1E3A8A),
                                    fontWeight: FontWeight.w700,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
      actions: [
        // Share & Earn Pill Button
        Center(
          child: Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => context.push(AppRoutes.referral),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF0EA5E9)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 4,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'Share & Earn',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

        Consumer(
          builder: (context, ref, _) {
            final unreadCountAsync =
                ref.watch(unreadNotificationsCountStreamProvider);
            final count = unreadCountAsync.value ?? 0;

            return Container(
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: IconButton(
                onPressed: () => context.push(AppRoutes.notifications),
                icon: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    const Icon(
                      Icons.notifications_outlined,
                      color: Color(0xFF1E293B),
                      size: 22,
                    ),
                    if (count > 0)
                      Positioned(
                        right: -3,
                        top: -3,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: const BoxDecoration(
                            color: AppColors.error,
                            shape: BoxShape.circle,
                          ),
                          constraints: const BoxConstraints(
                            minWidth: 15,
                            minHeight: 15,
                          ),
                          child: Text(
                            count > 9 ? '9+' : '$count',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 8,
                              fontWeight: FontWeight.w800,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: const Color(0xFFF1F5F9)),
      ),
    );
  }
}
