import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/widgets.dart';

class LocalMartComingSoonView extends StatefulWidget {
  final VoidCallback onSwitchToGate;

  const LocalMartComingSoonView({
    super.key,
    required this.onSwitchToGate,
  });

  @override
  State<LocalMartComingSoonView> createState() =>
      _LocalMartComingSoonViewState();
}

class _LocalMartComingSoonViewState extends State<LocalMartComingSoonView> {
  bool _isNotified = false;

  void _toggleNotify() {
    setState(() => _isNotified = !_isNotified);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isNotified
            ? '🎉 You\'re on the VIP list! We will notify you when LocalMart launches in your society.'
            : 'Notification preference updated.'),
        backgroundColor:
            _isNotified ? const Color(0xFF059669) : AppColors.primary,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Hero Coming Soon Showcase Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF065F46), Color(0xFF059669)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.xl),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF059669).withValues(alpha: 0.25),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.bolt_rounded,
                            color: Color(0xFFFDE047), size: 14),
                        SizedBox(width: 4),
                        Text(
                          'COMING SOON TO YOUR SOCIETY',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'GateLink LocalMart\n& Society Services',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'One-tap domestic help, verified home repairs, and doorstep daily essentials — curated exclusively for your society.',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 13,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _toggleNotify,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isNotified
                      ? const Color(0xFFFDE047)
                      : Colors.white,
                  foregroundColor: const Color(0xFF065F46),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                ),
                icon: Icon(
                  _isNotified
                      ? Icons.check_circle_rounded
                      : Icons.notifications_active_rounded,
                  size: 18,
                ),
                label: Text(
                  _isNotified ? 'Notification Enabled ✓' : 'Notify Me When Live',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Section Title: What's Coming
        const Text(
          'What You Can Do on LocalMart',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        // Feature 1: Hire Domestic Staff
        _FeaturePreviewCard(
          icon: Icons.cleaning_services_rounded,
          iconBg: const Color(0xFFE0F2FE),
          iconColor: const Color(0xFF0284C7),
          title: 'Hire Verified Maids & Staff',
          subtitle:
              'Browse background-verified Maids, Cooks, Babysitters, and Drivers with verified ratings from neighbor flats.',
          badge: 'STAFF & MAIDS',
          badgeColor: const Color(0xFF0284C7),
        ),
        const SizedBox(height: AppSpacing.md),

        // Feature 2: Society Store & Essentials
        _FeaturePreviewCard(
          icon: Icons.shopping_bag_rounded,
          iconBg: const Color(0xFFECFDF5),
          iconColor: const Color(0xFF059669),
          title: 'Society Store & Daily Delivery',
          subtitle:
              'Order 20L purified water cans, organic daily milk, farm-fresh eggs, and bakery items delivered directly to your flat.',
          badge: 'STORE & ESSENTIALS',
          badgeColor: const Color(0xFF059669),
        ),
        const SizedBox(height: AppSpacing.md),

        // Feature 3: On-Demand Home Services
        _FeaturePreviewCard(
          icon: Icons.handyman_rounded,
          iconBg: const Color(0xFFFEF3C7),
          iconColor: const Color(0xFFD97706),
          title: 'On-Demand Home Repairs',
          subtitle:
              'Instant booking for certified Electricians, Plumbers, AC Servicing, Pest Control, and Deep Home Cleaning with transparent rates.',
          badge: 'SERVICES & REPAIR',
          badgeColor: const Color(0xFFD97706),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Back to Society Gate Button
        Center(
          child: TextButton.icon(
            onPressed: widget.onSwitchToGate,
            icon: const Icon(Icons.arrow_back_rounded, size: 18),
            label: const Text(
              'Back to Society Gate & Security',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
      ],
    );
  }
}

class _FeaturePreviewCard extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final String subtitle;
  final String badge;
  final Color badgeColor;

  const _FeaturePreviewCard({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.badge,
    required this.badgeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: badgeColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(AppRadius.xs),
                      ),
                      child: Text(
                        badge,
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: badgeColor,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
