import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class CommunityHubComingSoonView extends StatefulWidget {
  final VoidCallback onSwitchToGate;

  const CommunityHubComingSoonView({
    super.key,
    required this.onSwitchToGate,
  });

  @override
  State<CommunityHubComingSoonView> createState() =>
      _CommunityHubComingSoonViewState();
}

class _CommunityHubComingSoonViewState
    extends State<CommunityHubComingSoonView> {
  bool _isNotified = false;

  void _toggleNotify() {
    setState(() => _isNotified = !_isNotified);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isNotified
            ? 'You will be notified as soon as Community Hub launches in your society.'
            : 'Notification preference updated.'),
        backgroundColor:
            _isNotified ? const Color(0xFF0F766E) : AppColors.primary,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Hero Showcase Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF134E4A), Color(0xFF0F766E)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.card),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF0F766E).withValues(alpha: 0.2),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 9, vertical: 3.5),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: const Text(
                  'COMING SOON TO YOUR SOCIETY',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'GateLink Community Hub\n& Resident Services',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'A trusted direct mediator for your society: buy & sell pre-owned items with neighbors, hire verified maids, and book on-demand local professionals.',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _toggleNotify,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isNotified
                      ? const Color(0xFF99F6E4)
                      : Colors.white,
                  foregroundColor: const Color(0xFF134E4A),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.button),
                  ),
                ),
                icon: Icon(
                  _isNotified
                      ? Icons.check_circle_rounded
                      : Icons.notifications_active_outlined,
                  size: 16,
                ),
                label: Text(
                  _isNotified ? 'Notification Enabled' : 'Notify Me When Live',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),

        // Section Title
        const Text(
          'What You Can Do in Community Hub',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Feature 1: Resident Buy & Sell Classifieds
        const _HubFeatureCard(
          icon: Icons.sell_outlined,
          iconBg: Color(0xFFF0FDF4),
          iconColor: Color(0xFF16A34A),
          title: 'Resident Buy & Sell (Classifieds)',
          subtitle:
              'Sell or buy pre-owned bikes, scooties, furniture, appliances, and electronics directly to neighbors with zero middleman fees.',
          badge: 'CLASSIFIEDS & BAZAAR',
          badgeColor: Color(0xFF16A34A),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Feature 2: Hire Verified Domestic Staff
        const _HubFeatureCard(
          icon: Icons.badge_outlined,
          iconBg: Color(0xFFF0F9FF),
          iconColor: Color(0xFF0284C7),
          title: 'Hire Verified Maids & Staff',
          subtitle:
              'Find and connect with trusted Maids, Cooks, Babysitters, and Drivers recommended and reviewed by neighbor flats.',
          badge: 'STAFF & MAIDS',
          badgeColor: Color(0xFF0284C7),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Feature 3: Doorstep Beauticians & Home Services
        const _HubFeatureCard(
          icon: Icons.auto_awesome_outlined,
          iconBg: Color(0xFFFEF3C7),
          iconColor: Color(0xFFD97706),
          title: 'Beauticians, Tutors & Home Repairs',
          subtitle:
              'Book verified doorstep Salon & Beauticians, Fitness Trainers, Tutors, Certified Electricians, and Plumbers.',
          badge: 'SERVICES & EXPERTS',
          badgeColor: Color(0xFFD97706),
        ),
        const SizedBox(height: AppSpacing.lg),

        // Back to Society Gate
        Center(
          child: TextButton.icon(
            onPressed: widget.onSwitchToGate,
            icon: const Icon(Icons.arrow_back_rounded, size: 16),
            label: const Text(
              'Back to Society Gate & Security',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
      ],
    );
  }
}

class _HubFeatureCard extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final String subtitle;
  final String badge;
  final Color badgeColor;

  const _HubFeatureCard({
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
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 12),
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
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                      ),
                      child: Text(
                        badge,
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: badgeColor,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Color(0xFF64748B),
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
