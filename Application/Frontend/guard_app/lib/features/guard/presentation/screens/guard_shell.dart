import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/providers/language_provider.dart';

class GuardShell extends ConsumerStatefulWidget {
  final Widget child;
  const GuardShell({super.key, required this.child});

  @override
  ConsumerState<GuardShell> createState() => _GuardShellState();
}

class _GuardShellState extends ConsumerState<GuardShell> {
  DateTime? _lastBackPressTime;

  @override
  Widget build(BuildContext context) {
    final tr = ref.watch(stringsProvider);
    final currentPath = GoRouterState.of(context).uri.path;

    final navItems = [
      _GuardNavItem(
        label: tr.get('nav_gate'),
        icon: Icons.shield_outlined,
        activeIcon: Icons.shield_rounded,
        route: '/guard/dashboard',
      ),
      _GuardNavItem(
        label: tr.get('nav_qr_scan'),
        icon: Icons.qr_code_scanner_outlined,
        activeIcon: Icons.qr_code_scanner_rounded,
        route: '/guard/scan',
      ),
      _GuardNavItem(
        label: tr.get('nav_quick_entry'),
        icon: Icons.person_add_alt_outlined,
        activeIcon: Icons.person_add_alt_1_rounded,
        route: '/guard/quick-entry',
      ),
      _GuardNavItem(
        label: tr.get('nav_vehicles'),
        icon: Icons.directions_car_outlined,
        activeIcon: Icons.directions_car_rounded,
        route: '/guard/vehicles',
      ),
      _GuardNavItem(
        label: tr.get('nav_profile'),
        icon: Icons.person_outline_rounded,
        activeIcon: Icons.person_rounded,
        route: '/guard/profile',
      ),
    ];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;

        // 1. Check if there is a pushed modal / route on top
        if (GoRouter.of(context).canPop()) {
          context.pop();
          return;
        }

        // 2. If on secondary tab, return to Guard Gate Log Dashboard
        final isDashboard = currentPath == '/guard/dashboard' || currentPath == '/guard';
        if (!isDashboard) {
          context.go('/guard/dashboard');
          return;
        }

        // 3. Double-back-to-exit on Guard Dashboard
        final now = DateTime.now();
        if (_lastBackPressTime == null ||
            now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
          _lastBackPressTime = now;
          ScaffoldMessenger.of(context).removeCurrentSnackBar();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text(
                'Press back again to exit GateLink Guard',
                style: TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
              ),
              behavior: SnackBarBehavior.floating,
              backgroundColor: AppColors.textPrimary,
              duration: const Duration(seconds: 2),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            ),
          );
          return;
        }

        Navigator.of(context, rootNavigator: true).maybePop();
      },
      child: Scaffold(
        body: widget.child,
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: const Border(
              top: BorderSide(color: AppColors.border, width: 1),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 16,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: List.generate(navItems.length, (index) {
                  final item = navItems[index];
                  final isActive = currentPath.startsWith(item.route) ||
                      (item.route == '/guard/dashboard' && currentPath == '/guard');

                  return Expanded(
                    child: GestureDetector(
                      onTap: () => context.go(item.route),
                      behavior: HitTestBehavior.opaque,
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
                        decoration: BoxDecoration(
                          color: isActive
                              ? const Color(0xFF1E3A8A).withValues(alpha: 0.1)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              isActive ? item.activeIcon : item.icon,
                              color: isActive ? const Color(0xFF1E3A8A) : AppColors.gray600,
                              size: 24,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.label,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
                                color: isActive ? const Color(0xFF1E3A8A) : AppColors.gray600,
                                letterSpacing: 0.1,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _GuardNavItem {
  final String label;
  final IconData icon;
  final IconData activeIcon;
  final String route;

  const _GuardNavItem({
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.route,
  });
}
