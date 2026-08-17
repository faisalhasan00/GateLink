/// Spacing tokens from UI-001 Design System Specification
/// Base grid unit: 8px
class AppSpacing {
  AppSpacing._();

  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
  static const double xxxl = 64.0;

  // Horizontal page padding
  static const double pagePadding = 20.0;

  // Card padding
  static const double cardPadding = 16.0;

  // Bottom safe area buffer
  static const double bottomSafe = 24.0;
}

/// Border radius tokens from UI-003
class AppRadius {
  AppRadius._();

  static const double sm = 4.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double xxl = 20.0;
  static const double card = 16.0;
  static const double button = 12.0;
  static const double full = 9999.0;
}

/// Animation duration tokens from UI-003
class AppDuration {
  AppDuration._();

  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 250);
  static const Duration slow = Duration(milliseconds: 400);
}
