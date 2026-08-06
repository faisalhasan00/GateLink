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
  static const String dashboard = '/dashboard';
  static const String scan = '/scan';
  static const String quickEntry = '/quick-entry';
  static const String vehicles = '/vehicles';
  static const String history = '/history';
  static const String profile = '/profile';
}

final guardRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: GuardRoutes.login,
    debugLogDiagnostics: true,
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
          GoRoute(
            path: '/visitors/:id',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return GuardVisitorDetailScreen(visitorId: id);
            },
          ),
        ],
      ),
    ],
  );
});
