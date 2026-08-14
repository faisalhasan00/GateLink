import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/guard/presentation/screens/guard_login_screen.dart';
import '../../features/guard/presentation/screens/guard_shell.dart';
import '../../features/guard/presentation/screens/guard_dashboard_screen.dart';
import '../../features/guard/presentation/screens/guard_profile_screen.dart';
import '../../features/guard/presentation/screens/guard_visitor_detail_screen.dart';
import '../../features/guard/presentation/screens/guard_visitor_history_screen.dart';
import '../../features/guard/presentation/screens/qr_scanner_screen.dart';
import '../../features/guard/presentation/screens/quick_entry_screen.dart';
import '../../features/guard/presentation/screens/vehicle_log_screen.dart';
import '../providers/auth_providers.dart';

class GuardRoutes {
  static const String login = '/login';
  static const String dashboard = '/guard/dashboard';
  static const String scan = '/guard/scan';
  static const String quickEntry = '/guard/quick-entry';
  static const String vehicles = '/guard/vehicles';
  static const String history = '/guard/history';
  static const String profile = '/guard/profile';
}

final guardRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: GuardRoutes.login,
    debugLogDiagnostics: true,
    errorBuilder: (context, state) => const GuardDashboardScreen(),
    redirect: (context, state) {
      final isLoading = authState.isLoading;
      if (isLoading) return null;

      final isAuth = authState.value != null;
      final isLoggingIn = state.uri.path == GuardRoutes.login;

      if (!isAuth && !isLoggingIn) return GuardRoutes.login;
      if (isAuth && isLoggingIn) return GuardRoutes.dashboard;

      return null;
    },
    routes: [
      GoRoute(
        path: GuardRoutes.login,
        builder: (context, state) => const GuardLoginScreen(),
      ),

      // Direct Aliases / Shortcuts
      GoRoute(
        path: '/dashboard',
        redirect: (context, state) => GuardRoutes.dashboard,
      ),
      GoRoute(
        path: '/scan',
        redirect: (context, state) => GuardRoutes.scan,
      ),
      GoRoute(
        path: '/quick-entry',
        redirect: (context, state) => GuardRoutes.quickEntry,
      ),
      GoRoute(
        path: '/vehicles',
        redirect: (context, state) => GuardRoutes.vehicles,
      ),
      GoRoute(
        path: '/history',
        redirect: (context, state) => GuardRoutes.history,
      ),
      GoRoute(
        path: '/profile',
        redirect: (context, state) => GuardRoutes.profile,
      ),
      GoRoute(
        path: '/home/profile',
        redirect: (context, state) => GuardRoutes.profile,
      ),
      GoRoute(
        path: '/home',
        redirect: (context, state) => GuardRoutes.dashboard,
      ),
      GoRoute(
        path: '/home/dashboard',
        redirect: (context, state) => GuardRoutes.dashboard,
      ),
      GoRoute(
        path: '/all',
        redirect: (context, state) => GuardRoutes.dashboard,
      ),
      GoRoute(
        path: '/home/visitors/:id',
        redirect: (context, state) => '/visitors/${state.pathParameters['id']}',
      ),

      // Guard Shell Navigation
      ShellRoute(
        builder: (context, state, child) => GuardShell(child: child),
        routes: [
          GoRoute(
            path: GuardRoutes.dashboard,
            builder: (context, state) => const GuardDashboardScreen(),
          ),
          GoRoute(
            path: GuardRoutes.scan,
            builder: (context, state) => const QrScannerScreen(),
          ),
          GoRoute(
            path: GuardRoutes.quickEntry,
            builder: (context, state) => const QuickEntryScreen(),
          ),
          GoRoute(
            path: GuardRoutes.vehicles,
            builder: (context, state) => const VehicleLogScreen(),
          ),
          GoRoute(
            path: GuardRoutes.history,
            builder: (context, state) => const GuardVisitorHistoryScreen(),
          ),
          GoRoute(
            path: GuardRoutes.profile,
            builder: (context, state) => const GuardProfileScreen(),
          ),
        ],
      ),

      // Detail Screen outside Shell
      GoRoute(
        path: '/visitors/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return GuardVisitorDetailScreen(visitorId: id);
        },
      ),
    ],
  );
});
