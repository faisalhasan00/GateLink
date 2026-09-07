import 'package:flutter/material.dart';

class InteriorsHeroBanner extends StatelessWidget {
  const InteriorsHeroBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(18),
        image: DecorationImage(
          image: const NetworkImage('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'),
          fit: BoxFit.cover,
          colorFilter: ColorFilter.mode(
            Colors.black.withOpacity(0.68),
            BlendMode.darken,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF59E0B),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: const Text(
                  '⭐ EXCLUSIVE IN-HOUSE STUDIO',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '4.9 ★ (120+ Flats)',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            'GateLink Living & Studio',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Bespoke turnkey home interiors exclusively engineered for society residents with zero gate approval friction.',
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFFE2E8F0),
              height: 1.35,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _FeaturePill(icon: Icons.security_rounded, label: '10-Yr Warranty'),
              const SizedBox(width: 8),
              _FeaturePill(icon: Icons.timer_rounded, label: '45-Day Move-in'),
              const SizedBox(width: 8),
              _FeaturePill(icon: Icons.local_offer_rounded, label: 'Society Discount'),
            ],
          ),
        ],
      ),
    );
  }
}

class _FeaturePill extends StatelessWidget {
  final IconData icon;
  final String label;

  const _FeaturePill({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 14, color: const Color(0xFF38BDF8)),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
