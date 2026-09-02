import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_providers.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/otp_screen.dart';
import '../../features/auth/presentation/screens/pending_approval_screen.dart';
import '../../features/guard/presentation/screens/guard_shell.dart';
import '../../features/guard/presentation/screens/guard_dashboard_screen.dart';
import '../../features/guard/presentation/screens/qr_scanner_screen.dart';
import '../../features/guard/presentation/screens/quick_entry_screen.dart';
import '../../features/guard/presentation/screens/vehicle_log_screen.dart';
import '../../features/guard/presentation/screens/guard_visitor_history_screen.dart';
import '../../features/guard/presentation/screens/guard_profile_screen.dart';
import '../../features/guard/presentation/screens/patrol_screen.dart';
import '../../features/visitor/presentation/screens/visitor_detail_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/notice/presentation/screens/notice_list_screen.dart';
import '../../features/notice/presentation/screens/notice_detail_screen.dart';

import '../../features/auth/presentation/screens/unauthorized_access_screen.dart';

/// All route paths for GateLink Guard App
class AppRoutes {
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String otp = '/otp';
  static const String pendingApproval = '/pending-approval';
  static const String unauthorized = '/unauthorized';
  
  // Guard Navigation Routes
  static const String guardDashboard = '/guard/dashboard';
  static const String guardScan = '/guard/scan';
  static const String guardPatrol = '/guard/patrol';
  static const String guardQuickEntry = '/guard/quick-entry';
  static const String guardVehicles = '/guard/vehicles';
  static const String guardHistory = '/guard/history';
  static const String profile = '/guard/profile';
  
  // Common & Detail Routes
  static const String notifications = '/notifications';
  static const String notices = '/notices';
  static const String noticeDetail = '/notices/:id';
  static const String visitorDetail = '/visitors/:id';
  
  // Legacy / Aliases
  static const String home = '/guard/dashboard';
  static const String dashboard = '/guard/dashboard';
  static const String visitors = '/guard/dashboard';
  static const String complaints = '/guard/dashboard';
  static const String amenities = '/guard/dashboard';
  static const String maintenance = '/guard/dashboard';
  static const String payMaintenance = '/guard/dashboard';
  static const String maintenanceHistory = '/guard/dashboard';
  static const String myBookings = '/guard/dashboard';
  static const String parking = '/guard/vehicles';
  static const String vehicles = '/guard/vehicles';
  static const String passcode = '/guard/scan';
  static const String scan = '/guard/scan';
  static const String quickEntry = '/guard/quick-entry';
  static const String documents = '/guard/dashboard';
  static const String residents = '/guard/dashboard';
  static const String editProfile = '/guard/profile';
  static const String changePassword = '/guard/profile';
  static const String raiseComplaint = '/guard/dashboard';
  static const String inviteVisitor = '/guard/quick-entry';
}

/// Helper class that converts a Stream into a Listenable for GoRouter.refreshListenable
class GoRouterRefreshStream extends ChangeNotifier {
  late final dynamic _subscription;

  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}

final appRouterProvider = Provider<GoRouter>((ref) {
  final authService = ref.watch(authServiceProvider);

  return GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: GoRouterRefreshStream(authService.authStateChanges),
    errorBuilder: (context, state) => const GuardDashboardScreen(),
    redirect: (context, state) {
      final user = authService.currentUser;
      final isAuth = user != null;
      final isSplash = state.uri.path == AppRoutes.splash;
      final isLoggingIn = state.uri.path == AppRoutes.login || 
                          state.uri.path == AppRoutes.onboarding ||
                          state.uri.path == AppRoutes.otp;

      final isPendingRoute = state.uri.path == AppRoutes.pendingApproval;
      final isUnauthorizedRoute = state.uri.path == AppRoutes.unauthorized;

      // Allow splash to render without kicking out to login prematurely
      if (isSplash) {
        return null;
      }

      // If user is unauthenticated and attempting to access protected screens
      if (!isAuth && !isLoggingIn) {
        return AppRoutes.login;
      }

      if (isAuth) {
        final profileAsync = ref.read(userProfileProvider);
        final userProfile = profileAsync.value;

        // If profile document has synced from Firestore, apply role-gating
        if (userProfile != null) {
          final role = (userProfile['role'] as String? ?? 'guard').toLowerCase();
          const allowedGuardRoles = [
            'guard',
            'security',
            'security_guard',
            'staff',
            'gatekeeper',
            'guard_leader',
            'admin',
            'society_admin',
            'super_admin',
          ];

          if (!allowedGuardRoles.contains(role)) {
            if (!isUnauthorizedRoute) {
              return AppRoutes.unauthorized;
            }
            return null;
          }

          if (isUnauthorizedRoute) {
            return AppRoutes.guardDashboard;
          }

          final status = (userProfile['status'] as String? ?? 'active').toLowerCase();
          final isApproved = status == 'active' || status == 'approved';

          if (!isApproved && !isPendingRoute) {
            return AppRoutes.pendingApproval;
          }

          if (isApproved && (isLoggingIn || isPendingRoute)) {
            return AppRoutes.guardDashboard;
          }
        } else {
          // Profile is still loading in background; allow logged-in guard to proceed to dashboard
          if (isLoggingIn || isPendingRoute) {
            return AppRoutes.guardDashboard;
          }
        }
      }

      return null;
    },
    debugLogDiagnostics: true,
    routes: [
      GoRoute(
        path: AppRoutes.unauthorized,
        builder: (context, state) => const UnauthorizedAccessScreen(),
      ),
      // Top-level Aliases & Shortcuts
      GoRoute(
        path: '/dashboard',
        redirect: (context, state) => AppRoutes.guardDashboard,
      ),
      GoRoute(
        path: '/scan',
        redirect: (context, state) => AppRoutes.guardScan,
      ),
      GoRoute(
        path: '/quick-entry',
        redirect: (context, state) => AppRoutes.guardQuickEntry,
      ),
      GoRoute(
        path: '/vehicles',
        redirect: (context, state) => AppRoutes.guardVehicles,
      ),
      GoRoute(
        path: '/history',
        redirect: (context, state) => AppRoutes.guardHistory,
      ),
      GoRoute(
        path: '/profile',
        redirect: (context, state) => AppRoutes.profile,
      ),
      GoRoute(
        path: '/home',
        redirect: (context, state) => AppRoutes.guardDashboard,
      ),
      GoRoute(
        path: '/home/dashboard',
        redirect: (context, state) => AppRoutes.guardDashboard,
      ),
      GoRoute(
        path: '/home/profile',
        redirect: (context, state) => AppRoutes.profile,
      ),
      GoRoute(
        path: '/home/visitors/:id',
        redirect: (context, state) => '/visitors/${state.pathParameters['id']}',
      ),
      GoRoute(
        path: '/all',
        redirect: (context, state) => AppRoutes.guardDashboard,
      ),

      // Auth & Onboarding Routes
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.otp,
        builder: (context, state) {
          final mobile = state.uri.queryParameters['mobile'] ?? '';
          return OtpScreen(mobileNumber: mobile);
        },
      ),
      GoRoute(
        path: AppRoutes.pendingApproval,
        builder: (context, state) => const PendingApprovalScreen(),
      ),

      // Primary Security Guard Shell
      ShellRoute(
        builder: (context, state, child) => GuardShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.guardDashboard,
            builder: (context, state) => const GuardDashboardScreen(),
          ),
          GoRoute(
            path: AppRoutes.guardScan,
            builder: (context, state) => const QrScannerScreen(),
          ),
          GoRoute(
            path: AppRoutes.guardPatrol,
            builder: (context, state) => const PatrolScreen(),
          ),
          GoRoute(
            path: AppRoutes.guardQuickEntry,
            builder: (context, state) => const QuickEntryScreen(),
          ),
          GoRoute(
            path: AppRoutes.guardVehicles,
            builder: (context, state) => const VehicleLogScreen(),
          ),
          GoRoute(
            path: AppRoutes.guardHistory,
            builder: (context, state) => const GuardVisitorHistoryScreen(),
          ),
          GoRoute(
            path: AppRoutes.profile,
            builder: (context, state) => const GuardProfileScreen(),
          ),
        ],
      ),

      // Detail screens outside shell
      GoRoute(
        path: AppRoutes.visitorDetail,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return VisitorDetailScreen(visitorId: id);
        },
      ),
      GoRoute(
        path: AppRoutes.notifications,
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.notices,
        builder: (context, state) => const NoticeListScreen(),
        routes: [
          GoRoute(
            path: ':id',
            builder: (context, state) {
              final id = state.pathParameters['id'] ?? '';
              return NoticeDetailScreen(noticeId: id);
            },
          ),
        ],
      ),
    ],
  );
});
