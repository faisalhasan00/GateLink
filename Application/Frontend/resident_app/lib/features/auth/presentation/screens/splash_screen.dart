import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _entryController;
  late AnimationController _pulseController;
  
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _badgeFadeAnimation;

  @override
  void initState() {
    super.initState();

    // 1. Entrance animation controller
    _entryController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    // 2. Continuous ambient pulse controller for background aura rings
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.65, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.0, 0.7, curve: Curves.easeOutBack),
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0.0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.3, 0.9, curve: Curves.easeOutCubic),
      ),
    );

    _badgeFadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.5, 1.0, curve: Curves.easeIn),
      ),
    );

    _entryController.forward();
    _resolveAuthAndNavigate();
  }

  Future<void> _resolveAuthAndNavigate() async {
    // 1. Premium brand splash duration (800ms)
    final minSplashDelay = Future.delayed(const Duration(milliseconds: 800));

    // 2. Check current user or wait for Firebase Auth disk session hydration
    User? user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      try {
        // Wait for Firebase to finish reading saved session credentials from local storage
        user = await FirebaseAuth.instance
            .authStateChanges()
            .firstWhere((u) => u != null)
            .timeout(const Duration(milliseconds: 1500));
      } catch (_) {
        // Fallback to latest currentUser instance if timeout reached
        user = FirebaseAuth.instance.currentUser;
      }
    }

    await minSplashDelay;
    if (!mounted) return;

    final resolvedUser = user ?? FirebaseAuth.instance.currentUser;

    if (resolvedUser != null) {
      context.go(AppRoutes.dashboard);
    } else {
      context.go(AppRoutes.login);
    }
  }

  @override
  void dispose() {
    _entryController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient: Luxury Deep Royal Navy & Slate
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0F172A), // Deep Slate
                  Color(0xFF1E3A8A), // Brand Navy
                  Color(0xFF0B192C), // Dark Abyss
                ],
              ),
            ),
          ),

          // Ambient Animated Glowing Aura Rings
          Center(
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                final pulseVal = _pulseController.value;
                return Stack(
                  alignment: Alignment.center,
                  children: [
                    // Outer Ring
                    Container(
                      width: 220 + (pulseVal * 30),
                      height: 220 + (pulseVal * 30),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF0EA5E9).withValues(alpha: 0.04 + (pulseVal * 0.05)),
                      ),
                    ),
                    // Inner Ring
                    Container(
                      width: 150 + (pulseVal * 20),
                      height: 150 + (pulseVal * 20),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF0EA5E9).withValues(alpha: 0.08 + (pulseVal * 0.08)),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),

          // Main Animated Content
          Center(
            child: AnimatedBuilder(
              animation: _entryController,
              builder: (context, child) {
                return FadeTransition(
                  opacity: _fadeAnimation,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Animated Logo Container
                      ScaleTransition(
                        scale: _scaleAnimation,
                        child: Container(
                          width: 104,
                          height: 104,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Colors.white,
                                Color(0xFFF8FAFC),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(28),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.8),
                              width: 1.5,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF0EA5E9).withValues(alpha: 0.35),
                                blurRadius: 36,
                                offset: const Offset(0, 14),
                              ),
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.25),
                                blurRadius: 20,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.apartment_rounded,
                              size: 58,
                              color: Color(0xFF1E3A8A),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 28),

                      // Brand Title with Slide Transition
                      SlideTransition(
                        position: _slideAnimation,
                        child: Column(
                          children: [
                            const Text(
                              'GateLink',
                              style: TextStyle(
                                fontSize: 38,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: -0.8,
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Subtitle Pill Badge
                            FadeTransition(
                              opacity: _badgeFadeAnimation,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 5,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: const Color(0xFF0EA5E9).withValues(alpha: 0.4),
                                    width: 1,
                                  ),
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.shield_outlined,
                                      size: 13,
                                      color: Color(0xFF38BDF8),
                                    ),
                                    SizedBox(width: 6),
                                    Text(
                                      'Smart Community OS',
                                      style: TextStyle(
                                        fontSize: 12.5,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFFE0F2FE),
                                        letterSpacing: 0.3,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Bottom Subtle Loading Dots
          Positioned(
            bottom: 48,
            left: 0,
            right: 0,
            child: FadeTransition(
              opacity: _badgeFadeAnimation,
              child: AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(3, (index) {
                      final delay = index * 0.33;
                      final progress = ((_pulseController.value + delay) % 1.0);
                      final opacity = 0.3 + (progress * 0.7);
                      return Container(
                        width: 7,
                        height: 7,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF38BDF8).withValues(alpha: opacity),
                        ),
                      );
                    }),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
