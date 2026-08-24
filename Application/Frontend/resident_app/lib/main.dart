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

import 'firebase_options.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/services/notification_service.dart';
import 'core/providers/firebase_providers.dart';

/// Background FCM handler — must be top-level
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    }
    await NotificationService.init();

    final data = message.data;
    final type = data['type'] as String? ?? '';
    final title = message.notification?.title ?? data['title'] as String? ?? 'GateLink Notice';
    final body = message.notification?.body ?? data['body'] as String? ?? 'New update received';

    if (type == 'visitor_pending') {
      final visitorName = data['visitorName'] as String? ?? 'Visitor';
      final visitorType = data['visitorType'] as String? ?? 'Guest';
      final flatNumber = data['hostFlat'] as String? ?? '';
      final visitorId = data['visitorId'] as String?;
      final societyId = data['societyId'] as String?;

      await NotificationService.showVisitorAlert(
        visitorName: visitorName,
        visitorType: visitorType,
        flatNumber: flatNumber,
        visitorId: visitorId,
        societyId: societyId,
      );
    } else if (type == 'sos' || type == 'emergency') {
      if (message.notification == null) {
        final residentName = data['residentName'] as String? ?? 'Resident';
        final flatNumber = data['flatNumber'] as String? ?? '';
        final alertType = data['alertType'] as String? ?? 'Emergency';
        await NotificationService.showSosAlert(
          residentName: residentName,
          flatNumber: flatNumber,
          alertType: alertType,
        );
      }
    } else if (message.notification == null) {
      // Only show local notification if Android OS did not automatically display the FCM payload
      await NotificationService.showNoticeAlert(
        title: title,
        body: body,
      );
    }
  } catch (e) {
    debugPrint('Background FCM error: $e');
  }
}

/// Saves the device FCM token to Firestore so Cloud Functions can reach this device.
Future<void> saveFcmToken() async {
  final user = FirebaseAuth.instance.currentUser;
  if (user == null) {
    debugPrint('saveFcmToken: No user logged in');
    return;
  }
  try {
    final token = await FirebaseMessaging.instance.getToken();
    if (token == null || token.isEmpty) {
      debugPrint('saveFcmToken: token is null or empty');
      return;
    }
    debugPrint('saveFcmToken: Fresh token generated => ${token.substring(0, 15)}...');
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
    debugPrint('FCM token saved to users/${user.uid}');
  } catch (e) {
    debugPrint('Error saving FCM token: $e');
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

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

    // Pass uncaught Flutter framework errors to Crashlytics
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;

    // Enable Crashlytics collection in release mode only
    await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(!kDebugMode);

    // Pass uncaught async errors to Crashlytics
    PlatformDispatcher.instance.onError = (error, stack) {
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
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Listen to auth state changes to guarantee fresh FCM token registration
  FirebaseAuth.instance.authStateChanges().listen((user) async {
    if (user != null) {
      debugPrint('Auth changed: User ${user.uid} logged in, syncing FCM token...');
      await saveFcmToken();
    }
  });

  runApp(
    const ProviderScope(
      child: GateLinkResidentApp(),
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

class GateLinkResidentApp extends ConsumerWidget {
  const GateLinkResidentApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    // Start watching for pending visitors and trigger local notifications
    ref.watch(visitorNotificationWatcherProvider);

    return MaterialApp.router(
      title: 'GateLink',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      routerConfig: router,
    );
  }
}
