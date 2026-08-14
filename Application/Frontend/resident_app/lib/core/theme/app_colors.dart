import 'package:flutter/material.dart';

/// Design tokens from UI-001 & UI-003 Design System Specification
class AppColors {
  AppColors._();

  // --- Brand Colors ---
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryLight = Color(0xFF3B82F6);
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color primarySurface = Color(0xFFEFF6FF);

  // --- Secondary ---
  static const Color secondary = Color(0xFF0F172A);

  // --- Semantic Colors ---
  static const Color success = Color(0xFF22C55E);
  static const Color successSurface = Color(0xFFF0FDF4);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningSurface = Color(0xFFFFFBEB);
  static const Color error = Color(0xFFEF4444);
  static const Color errorSurface = Color(0xFFFEF2F2);
  static const Color info = Color(0xFF06B6D4);
  static const Color infoSurface = Color(0xFFECFEFF);

  // --- Neutral Colors ---
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);
  static const Color divider = Color(0xFFF1F5F9);

  // --- Text Colors ---
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textDisabled = Color(0xFFCBD5E1);
  static const Color textOnPrimary = Color(0xFFFFFFFF);

  // --- Gray Scale ---
  static const Color gray50 = Color(0xFFF8FAFC);
  static const Color gray100 = Color(0xFFF1F5F9);
  static const Color gray200 = Color(0xFFE2E8F0);
  static const Color gray300 = Color(0xFFCBD5E1);
  static const Color gray400 = Color(0xFF94A3B8);
  static const Color gray500 = Color(0xFF64748B);
  static const Color gray600 = Color(0xFF475569);
  static const Color gray700 = Color(0xFF334155);
  static const Color gray800 = Color(0xFF1E293B);
  static const Color gray900 = Color(0xFF0F172A);

  // --- Feature-Specific Colors ---
  static const Color maintenance = Color(0xFF8B5CF6); // Purple
  static const Color visitor = Color(0xFF10B981); // Emerald
  static const Color complaint = Color(0xFFF97316); // Orange
  static const Color amenity = Color(0xFF3B82F6); // Blue
  static const Color parking = Color(0xFF6366F1); // Indigo
  static const Color notice = Color(0xFFF59E0B); // Amber
  static const Color payment = Color(0xFF22C55E); // Green
  static const Color security = Color(0xFFEF4444); // Red

  // --- Dark Theme ---
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF1E293B);
  static const Color darkBorder = Color(0xFF334155);
}
