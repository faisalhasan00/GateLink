// File generated for GateLink Firebase project.
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        return android;
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyAEqP0hDR5zhpflZ7zTgwk5RxSulpyEwtA',
    appId: '1:43273653500:web:9c2c8c55c64a7b7f8f9b79',
    messagingSenderId: '43273653500',
    projectId: 'societysphere-b2538',
    authDomain: 'societysphere-b2538.firebaseapp.com',
    storageBucket: 'societysphere-b2538.firebasestorage.app',
    measurementId: 'G-V5C3WYBEXT',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyAnFVdWg7AwL8T_UpK1V6mznhBVHYhimWA',
    appId: '1:43273653500:android:85c8b16fc58e3a8b8f9b79',
    messagingSenderId: '43273653500',
    projectId: 'societysphere-b2538',
    storageBucket: 'societysphere-b2538.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyDm55Y6qjtBfe18V83vvOKOAmE2YU9Zwww',
    appId: '1:43273653500:ios:d5c796c4b9687df58f9b79',
    messagingSenderId: '43273653500',
    projectId: 'societysphere-b2538',
    storageBucket: 'societysphere-b2538.firebasestorage.app',
    iosBundleId: 'in.gatelink.admin',
  );
}
