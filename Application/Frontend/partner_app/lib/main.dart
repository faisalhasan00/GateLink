import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/theme/app_colors.dart';
import 'core/providers/partner_auth_provider.dart';
import 'features/auth/presentation/screens/partner_login_screen.dart';
import 'features/home/presentation/screens/partner_dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
  } catch (err) {
    // Fallback if already initialized
  }
  runApp(const ProviderScope(child: GateLinkPartnerApp()));
}

class GateLinkPartnerApp extends ConsumerWidget {
  const GateLinkPartnerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final partnerUser = ref.watch(partnerAuthProvider);

    return MaterialApp(
      title: 'GateLink Partner',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          primary: AppColors.primary,
          secondary: AppColors.secondary,
          surface: AppColors.background,
        ),
        scaffoldBackgroundColor: AppColors.background,
        fontFamily: 'Inter',
      ),
      home: partnerUser != null ? const PartnerDashboardScreen() : const PartnerLoginScreen(),
    );
  }
}
