import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';

class HomeShell extends StatefulWidget {
  final Widget child;
  const HomeShell({super.key, required this.child});

  static const List<_NavItem> _navItems = [
    _NavItem(
        label: 'Home',
        icon: Icons.home_outlined,
        activeIcon: Icons.home_rounded,
        route: '/home/dashboard'),
    _NavItem(
        label: 'Visitors',
        icon: Icons.shield_outlined,
        activeIcon: Icons.shield_rounded,
        route: '/home/visitors'),
    _NavItem(
        label: 'Bills',
        icon: Icons.receipt_long_outlined,
        activeIcon: Icons.receipt_long_rounded,
        route: '/home/maintenance'),
    _NavItem(
        label: 'Help',
        icon: Icons.support_agent_outlined,
        activeIcon: Icons.support_agent_rounded,
        route: '/home/complaints'),
    _NavItem(
        label: 'Profile',
        icon: Icons.person_outline_rounded,
        activeIcon: Icons.person_rounded,
        route: '/home/profile'),
  ];

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  DateTime? _lastBackPressTime;

  @override
  Widget build(BuildContext context) {
    final currentPath = GoRouterState.of(context).uri.path;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;

        // 1. Check if there is a pushed route / dialog on the navigator stack
        if (GoRouter.of(context).canPop()) {
          context.pop();
          return;
        }

        // 2. If user is on a sub-screen or secondary tab, navigate back to Home Dashboard
        final isHomeTab = currentPath == '/home/dashboard' || currentPath == '/home';
        if (!isHomeTab) {
          context.go('/home/dashboard');
          return;
        }

        // 3. Double-back-to-exit on the root Home screen
        final now = DateTime.now();
        if (_lastBackPressTime == null ||
            now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
          _lastBackPressTime = now;
          ScaffoldMessenger.of(context).removeCurrentSnackBar();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text(
                'Press back again to exit GateLink',
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

        // Second back press within 2s -> gracefully exit the app
        Navigator.of(context, rootNavigator: true).maybePop();
      },
      child: Scaffold(
        body: widget.child,
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: const Border(
              top: BorderSide(color: Color(0xFFF1F5F9), width: 1),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 16,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: List.generate(HomeShell._navItems.length, (index) {
                  final item = HomeShell._navItems[index];
                  final isActive = currentPath.startsWith(item.route) ||
                      (item.route == '/home/dashboard' && currentPath == '/home');
                  return Expanded(
                    child: _NavBarItem(
                      item: item,
                      isActive: isActive,
                      onTap: () => context.go(item.route),
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

class _NavBarItem extends StatelessWidget {
  final _NavItem item;
  final bool isActive;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.item,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 4),
        decoration: BoxDecoration(
          color: isActive
              ? AppColors.primarySurface
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isActive ? item.activeIcon : item.icon,
              color: isActive ? AppColors.primary : const Color(0xFF64748B),
              size: 22,
            ),
            const SizedBox(height: 3),
            Text(
              item.label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                color: isActive ? AppColors.primary : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem {
  final String label;
  final IconData icon;
  final IconData activeIcon;
  final String route;

  const _NavItem({
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.route,
  });
}
