import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_providers.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/otp_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/screens/pending_approval_screen.dart';
import '../../features/home/presentation/screens/home_shell.dart';
import '../../features/home/presentation/screens/dashboard_screen.dart';
import '../../features/maintenance/presentation/screens/maintenance_list_screen.dart';
import '../../features/maintenance/presentation/screens/pay_maintenance_screen.dart';
import '../../features/maintenance/presentation/screens/maintenance_history_screen.dart';
import '../../features/visitor/presentation/screens/visitor_list_screen.dart';
import '../../features/visitor/presentation/screens/invite_visitor_screen.dart';
import '../../features/visitor/presentation/screens/visitor_detail_screen.dart';
import '../../features/complaint/presentation/screens/complaint_list_screen.dart';
import '../../features/complaint/presentation/screens/raise_complaint_screen.dart';
import '../../features/complaint/presentation/screens/complaint_detail_screen.dart';
import '../../features/amenity/presentation/screens/amenity_list_screen.dart';
import '../../features/amenity/presentation/screens/amenity_booking_screen.dart';
import '../../features/amenity/presentation/screens/my_bookings_screen.dart';
import '../../features/notice/presentation/screens/notice_list_screen.dart';
import '../../features/notice/presentation/screens/notice_detail_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/profile/presentation/screens/edit_profile_screen.dart';
import '../../features/profile/presentation/screens/change_password_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/parking/presentation/screens/parking_screen.dart';
import '../../features/document/presentation/screens/document_screen.dart';
import '../../features/guard/presentation/screens/guard_shell.dart';
import '../../features/guard/presentation/screens/guard_dashboard_screen.dart';
import '../../features/guard/presentation/screens/qr_scanner_screen.dart';
import '../../features/guard/presentation/screens/quick_entry_screen.dart';
import '../../features/guard/presentation/screens/vehicle_log_screen.dart';
import '../../features/referral/presentation/screens/referral_screen.dart';

/// All route paths in one place
class AppRoutes {
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String otp = '/otp';
  static const String register = '/register';
  static const String pendingApproval = '/pending-approval';
  static const String home = '/home';
  static const String dashboard = '/home/dashboard';
  static const String notifications = '/home/notifications';
  // Referral
  static const String referral = '/home/referral';
  // Maintenance
  static const String maintenance = '/home/maintenance';
  static const String payMaintenance = '/home/maintenance/pay';
  static const String maintenanceHistory = '/home/maintenance/history';
  // Visitor
  static const String visitors = '/home/visitors';
  static const String inviteVisitor = '/home/visitors/invite';
  static const String visitorDetail = '/home/visitors/:id';
  // Complaint
  static const String complaints = '/home/complaints';
  static const String raiseComplaint = '/home/complaints/raise';
  static const String complaintDetail = '/home/complaints/:id';
  // Amenity
  static const String amenities = '/home/amenities';
  static const String bookAmenity = '/home/amenities/:id/book';
  static const String myBookings = '/home/amenities/my-bookings';
  // Notice
  static const String notices = '/home/notices';
  static const String noticeDetail = '/home/notices/:id';
  // Parking
  static const String parking = '/home/parking';
  // Documents
  static const String documents = '/home/documents';
  // Profile
  static const String profile = '/home/profile';
  static const String editProfile = '/home/profile/edit';
  static const String changePassword = '/home/profile/change-password';
  // Guard App Routes
  static const String guardDashboard = '/guard/dashboard';
  static const String guardScan = '/guard/scan';
  static const String guardQuickEntry = '/guard/quick-entry';
  static const String guardVehicles = '/guard/vehicles';
}

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  final userProfile = ref.watch(userProfileProvider).value;

  return GoRouter(
    initialLocation: AppRoutes.splash,
    redirect: (context, state) {
      final isLoading = authState.isLoading;
      if (isLoading) return null;

      final isAuth = authState.value != null;
      final isSplash = state.uri.path == AppRoutes.splash;
      final isLoggingIn = state.uri.path == AppRoutes.login ||
          state.uri.path == AppRoutes.register ||
          state.uri.path == AppRoutes.onboarding;

      final isPendingRoute = state.uri.path == AppRoutes.pendingApproval;

      if (isSplash) {
        if (!isAuth) return AppRoutes.onboarding;
        final status = userProfile?.status ?? 'active';
        if (status == 'active' || status == 'approved') {
          return AppRoutes.dashboard;
        }
        return AppRoutes.pendingApproval;
      }

      if (!isAuth && !isLoggingIn) {
        return AppRoutes.login;
      }

      if (isAuth) {
        final status = userProfile?.status ?? 'active';
        final isApproved = status == 'active' || status == 'approved';

        if (!isApproved && !isPendingRoute) {
          return AppRoutes.pendingApproval;
        }

        if (isApproved && (isLoggingIn || isPendingRoute)) {
          return AppRoutes.dashboard;
        }
      }

      return null;
    },
    errorBuilder: (context, state) => const DashboardScreen(),
    debugLogDiagnostics: true,
    routes: [
      // Top-level Aliases & Shortcuts to prevent No-Route GoExceptions
      GoRoute(
        path: '/home',
        redirect: (context, state) => AppRoutes.dashboard,
      ),
      GoRoute(
        path: '/dashboard',
        redirect: (context, state) => AppRoutes.dashboard,
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
        path: '/referral',
        redirect: (context, state) => AppRoutes.referral,
      ),
      GoRoute(
        path: '/profile',
        redirect: (context, state) => AppRoutes.profile,
      ),
      GoRoute(
        path: '/profile/edit',
        redirect: (context, state) => AppRoutes.editProfile,
      ),
      GoRoute(
        path: '/profile/change-password',
        redirect: (context, state) => AppRoutes.changePassword,
      ),
      GoRoute(
        path: '/history',
        redirect: (context, state) => AppRoutes.dashboard,
      ),
      GoRoute(
        path: '/all',
        redirect: (context, state) => AppRoutes.dashboard,
      ),
      GoRoute(
        path: '/visitors',
        redirect: (context, state) => AppRoutes.visitors,
      ),
      GoRoute(
        path: '/visitors/:id',
        redirect: (context, state) => '/home/visitors/${state.pathParameters['id']}',
      ),
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
        path: AppRoutes.register,
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: AppRoutes.pendingApproval,
        builder: (context, state) => const PendingApprovalScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => HomeShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.dashboard,
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: AppRoutes.notifications,
            builder: (context, state) => const NotificationsScreen(),
          ),
          GoRoute(
            path: AppRoutes.maintenance,
            builder: (context, state) => const MaintenanceListScreen(),
            routes: [
              GoRoute(
                path: 'pay',
                builder: (context, state) => const PayMaintenanceScreen(),
              ),
              GoRoute(
                path: 'history',
                builder: (context, state) => const MaintenanceHistoryScreen(),
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.visitors,
            builder: (context, state) => const VisitorListScreen(),
            routes: [
              GoRoute(
                path: 'invite',
                builder: (context, state) => const InviteVisitorScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return VisitorDetailScreen(visitorId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.complaints,
            builder: (context, state) => const ComplaintListScreen(),
            routes: [
              GoRoute(
                path: 'raise',
                builder: (context, state) => const RaiseComplaintScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return ComplaintDetailScreen(complaintId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.amenities,
            builder: (context, state) => const AmenityListScreen(),
            routes: [
              GoRoute(
                path: 'my-bookings',
                builder: (context, state) => const MyBookingsScreen(),
              ),
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return AmenityBookingScreen(amenityId: id);
                },
              ),
              GoRoute(
                path: ':id/book',
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return AmenityBookingScreen(amenityId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.notices,
            builder: (context, state) => const NoticeListScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return NoticeDetailScreen(noticeId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.parking,
            builder: (context, state) => const ParkingScreen(),
          ),
          GoRoute(
            path: AppRoutes.documents,
            builder: (context, state) => const DocumentScreen(),
          ),
          GoRoute(
            path: AppRoutes.referral,
            builder: (context, state) => const ReferralScreen(),
          ),
          GoRoute(
            path: AppRoutes.profile,
            builder: (context, state) => const ProfileScreen(),
            routes: [
              GoRoute(
                path: 'edit',
                builder: (context, state) => const EditProfileScreen(),
              ),
              GoRoute(
                path: 'change-password',
                builder: (context, state) => const ChangePasswordScreen(),
              ),
            ],
          ),
        ],
      ),
      // Security Guard App Shell
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
            path: AppRoutes.guardQuickEntry,
            builder: (context, state) => const QuickEntryScreen(),
          ),
          GoRoute(
            path: AppRoutes.guardVehicles,
            builder: (context, state) => const VehicleLogScreen(),
          ),
        ],
      ),
    ],
  );
});
