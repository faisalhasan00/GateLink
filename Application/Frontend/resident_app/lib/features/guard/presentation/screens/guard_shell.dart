import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';

class GuardShell extends StatefulWidget {
  final Widget child;
  const GuardShell({super.key, required this.child});

  @override
  State<GuardShell> createState() => _GuardShellState();
}

class _GuardShellState extends State<GuardShell> {
  int _currentIndex = 0;
  DateTime? _lastBackPressTime;

  final List<_GuardNavItem> _navItems = const [
    _GuardNavItem(
      label: 'Gate Log',
      icon: Icons.shield_outlined,
      activeIcon: Icons.shield_rounded,
      route: '/dashboard',
    ),
    _GuardNavItem(
      label: 'QR Scan',
      icon: Icons.qr_code_scanner_outlined,
      activeIcon: Icons.qr_code_scanner_rounded,
      route: '/scan',
    ),
    _GuardNavItem(
      label: 'Quick Entry',
      icon: Icons.person_add_alt_outlined,
      activeIcon: Icons.person_add_alt_1_rounded,
      route: '/quick-entry',
    ),
    _GuardNavItem(
      label: 'Vehicles',
      icon: Icons.directions_car_outlined,
      activeIcon: Icons.directions_car_rounded,
      route: '/vehicles',
    ),
    _GuardNavItem(
      label: 'History',
      icon: Icons.history_toggle_off_rounded,
      activeIcon: Icons.history_rounded,
      route: '/history',
    ),
    _GuardNavItem(
      label: 'Profile',
      icon: Icons.person_outline_rounded,
      activeIcon: Icons.person_rounded,
      route: '/profile',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final currentPath = GoRouterState.of(context).uri.path;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;

        if (GoRouter.of(context).canPop()) {
          context.pop();
          return;
        }

        final isDashboard = currentPath == '/dashboard' || currentPath == '/guard/dashboard' || currentPath == '/guard';
        if (!isDashboard) {
          context.go('/dashboard');
          return;
        }

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
          color: AppColors.secondary, // Dark sleek theme for Security Guard app
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.15),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(_navItems.length, (index) {
                final item = _navItems[index];
                final isActive = _currentIndex == index;
                return Flexible(
                  child: GestureDetector(
                    onTap: () {
                      setState(() => _currentIndex = index);
                      context.go(item.route);
                    },
                    behavior: HitTestBehavior.opaque,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 6),
                      decoration: BoxDecoration(
                        color:
                            isActive ? AppColors.primary : Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isActive ? item.activeIcon : item.icon,
                            color: isActive ? Colors.white : AppColors.gray400,
                            size: 22,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item.label,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight:
                                  isActive ? FontWeight.w600 : FontWeight.w400,
                              color:
                                  isActive ? Colors.white : AppColors.gray400,
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
