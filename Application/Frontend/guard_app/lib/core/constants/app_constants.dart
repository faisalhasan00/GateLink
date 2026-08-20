/// Base URL for all API calls
class AppConstants {
  AppConstants._();

  // API
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1'; // Android emulator localhost
  static const String baseUrlIos = 'http://127.0.0.1:8000/api/v1'; // iOS simulator localhost

  // Secure Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String userRoleKey = 'user_role';
  static const String onboardingKey = 'onboarding_done';

  // OTP
  static const int otpLength = 6;
  static const int otpExpiryMinutes = 5;
  static const int otpMaxResendAttempts = 3;

  // Pagination
  static const int defaultPageSize = 20;

  // Image Upload
  static const int maxImageSizeBytes = 5 * 1024 * 1024; // 5MB

  // App Info
  static const String appName = 'GateLink';
  static const String appVersion = '1.0.0';
  static const String supportEmail = 'gatelink.in@gmail.com';
  static const String supportPhone = '+91 9121863117';

  // Account Status
  static const String statusPending = 'pending';
  static const String statusActive = 'active';
  static const String statusRejected = 'rejected';
  static const String statusSuspended = 'suspended';

  // User Roles
  static const String roleResident = 'resident';
  static const String roleSecurityGuard = 'security_guard';
  static const String roleStaff = 'staff';
  static const String roleSocietyAdmin = 'society_admin';
  static const String roleSuperAdmin = 'super_admin';
}
