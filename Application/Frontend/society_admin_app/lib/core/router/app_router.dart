import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/society_select_screen.dart';
import '../../features/main_navigation/presentation/main_scaffold_screen.dart';
import '../../features/residents/presentation/residents_screen.dart';
import '../../features/gate_security/presentation/gate_security_screen.dart';
import '../../features/maintenance/presentation/maintenance_screen.dart';
import '../../features/complaints/presentation/complaints_screen.dart';
import '../../features/notices/presentation/notices_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/amenities/presentation/amenities_screen.dart';
import '../../features/staff/presentation/staff_screen.dart';
import '../../features/helpers/presentation/helpers_screen.dart';
import '../../features/polls/presentation/polls_screen.dart';
import '../../features/parking/presentation/parking_screen.dart';
import '../../features/documents/presentation/documents_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final user = FirebaseAuth.instance.currentUser;
      final loggingIn = state.uri.toString() == '/login';

      if (user == null && !loggingIn) {
        return '/login';
      }
      if (user != null && loggingIn) {
        return '/select-society';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        redirect: (_, __) {
          final user = FirebaseAuth.instance.currentUser;
          return user != null ? '/dashboard' : '/login';
        },
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/select-society',
        builder: (context, state) => const SocietySelectScreen(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const MainScaffoldScreen(),
      ),
      GoRoute(
        path: '/residents',
        builder: (context, state) => const ResidentsScreen(),
      ),
      GoRoute(
        path: '/gate-security',
        builder: (context, state) => const GateSecurityScreen(),
      ),
      GoRoute(
        path: '/maintenance',
        builder: (context, state) => const MaintenanceScreen(),
      ),
      GoRoute(
        path: '/complaints',
        builder: (context, state) => const ComplaintsScreen(),
      ),
      GoRoute(
        path: '/notices',
        builder: (context, state) => const NoticesScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/amenities',
        builder: (context, state) => const AmenitiesScreen(),
      ),
      GoRoute(
        path: '/staff',
        builder: (context, state) => const StaffScreen(),
      ),
      GoRoute(
        path: '/helpers',
        builder: (context, state) => const HelpersScreen(),
      ),
      GoRoute(
        path: '/polls',
        builder: (context, state) => const PollsScreen(),
      ),
      GoRoute(
        path: '/parking',
        builder: (context, state) => const ParkingScreen(),
      ),
      GoRoute(
        path: '/documents',
        builder: (context, state) => const DocumentsScreen(),
      ),
    ],
  );
}
