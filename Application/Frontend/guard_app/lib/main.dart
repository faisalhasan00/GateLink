import 'package:firebase_app_check/firebase_app_check.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_fonts/google_fonts.dart';

import 'firebase_options.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_colors.dart';
import 'core/services/notification_service.dart';

/// Background FCM handler — must be top-level
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  debugPrint('Background FCM message: ${message.notification?.title}');
}

/// Saves the device FCM token to Firestore so Cloud Functions can reach this device.
Future<void> saveFcmToken() async {
  final user = FirebaseAuth.instance.currentUser;
  if (user == null) return;
  try {
    final token = await FirebaseMessaging.instance.getToken();
    if (token == null) return;
    final userDoc = await FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .get();
    final societyId =
        (userDoc.data()?['societyId'] as String?)?.trim() ?? '';
    if (societyId.isNotEmpty) {
      await FirebaseFirestore.instance
          .collection('societies/$societyId/users')
          .doc(user.uid)
          .set({'fcmToken': token}, SetOptions(merge: true));
      debugPrint('FCM token saved for society $societyId');
    }
    // Also save directly to user mapping doc
    await FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .set({'fcmToken': token}, SetOptions(merge: true));
  } catch (e) {
    debugPrint('Error saving FCM token: $e');
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Prevent GoogleFonts from throwing uncaught HTTP exceptions when offline/slow connection
  GoogleFonts.config.allowRuntimeFetching = false;

  // Initialize Firebase safely
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    // Initialize Firebase App Check safely (Play Integrity for prod, Debug for dev)
    try {
      await FirebaseAppCheck.instance.activate(
        androidProvider: kDebugMode ? AndroidProvider.debug : AndroidProvider.playIntegrity,
        appleProvider: kDebugMode ? AppleProvider.debug : AppleProvider.deviceCheck,
      );
    } catch (appCheckErr) {
      debugPrint('Firebase App Check init note: $appCheckErr');
    }

    // Pass uncaught Flutter framework errors to Crashlytics (with non-fatal font guard)
    FlutterError.onError = (FlutterErrorDetails details) {
      if (details.exceptionAsString().contains('GoogleFonts') ||
          details.exceptionAsString().contains('Failed to load font') ||
          details.exceptionAsString().contains('was not found in the application assets')) {
        debugPrint('Non-fatal font load exception handled: ${details.exception}');
        return;
      }
      FirebaseCrashlytics.instance.recordFlutterFatalError(details);
    };

    // Enable Crashlytics collection in release mode only
    await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(!kDebugMode);

    // Pass uncaught async errors to Crashlytics (with non-fatal font guard)
    PlatformDispatcher.instance.onError = (error, stack) {
      if (error.toString().contains('GoogleFonts') ||
          error.toString().contains('Failed to load font') ||
          error.toString().contains('was not found in the application assets')) {
        debugPrint('Non-fatal async font exception handled: $error');
        return true;
      }
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };
  } catch (e) {
    debugPrint('Firebase/Crashlytics init error: $e');
  }

  // Initialize local notifications safely
  try {
    await NotificationService.init();
  } catch (e) {
    debugPrint('NotificationService init error: $e');
  }

  // Register background FCM handler
  try {
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  } catch (e) {
    debugPrint('FCM background handler error: $e');
  }

  // Lock to portrait orientation
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(
    const ProviderScope(
      child: GateLinkGuardApp(),
    ),
  );

  // Non-blocking FCM background registration after UI mounts
  Future.microtask(() async {
    try {
      await FirebaseMessaging.instance.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      await saveFcmToken();
      FirebaseMessaging.instance.onTokenRefresh.listen((_) => saveFcmToken());
    } catch (e) {
      debugPrint('FCM token setup error: $e');
    }
  });
}

class GateLinkGuardApp extends ConsumerWidget {
  const GateLinkGuardApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'GateLink Guard',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.secondary,
          primary: AppColors.secondary,
          secondary: AppColors.primary,
        ),
        scaffoldBackgroundColor: AppColors.background,
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
          backgroundColor: AppColors.secondary,
          foregroundColor: Colors.white,
        ),
      ),
      routerConfig: router,
    );
  }
}