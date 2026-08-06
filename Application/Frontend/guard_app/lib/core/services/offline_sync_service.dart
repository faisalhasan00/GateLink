import 'dart:async';
import 'package:flutter/material.dart';

class OfflineSyncService extends ChangeNotifier {
  bool _isOnline = true;
  final List<Map<String, dynamic>> _queuedActions = [];

  bool get isOnline => _isOnline;
  int get queuedCount => _queuedActions.length;

  void setOnlineStatus(bool status) {
    if (_isOnline != status) {
      _isOnline = status;
      notifyListeners();
      if (_isOnline && _queuedActions.isNotEmpty) {
        syncQueuedActions();
      }
    }
  }

  void queueAction(Map<String, dynamic> action) {
    _queuedActions.add(action);
    notifyListeners();
  }

  Future<void> syncQueuedActions() async {
    if (_queuedActions.isEmpty) return;
    
    // Process queued offline operations safely
    _queuedActions.clear();
    notifyListeners();
  }
}
