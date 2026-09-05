import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/notifications/doorbell_sound_service.dart';
import '../widgets/gate_entry_approval_dialog.dart';

/// Full-screen interactive Doorbell & Delivery Action Modal Screen.
/// Plays brand doorbell ringtone in loop until action is taken.
class DoorbellActionOverlayScreen extends ConsumerStatefulWidget {
  final String visitorId;
  final String societyId;
  final String visitorName;
  final String visitorType;
  final String flatNumber;
  final String? company;
  final String? vehicleNumber;
  final String? gateName;
  final String? photoUrl;

  const DoorbellActionOverlayScreen({
    super.key,
    required this.visitorId,
    required this.societyId,
    required this.visitorName,
    required this.visitorType,
    required this.flatNumber,
    this.company,
    this.vehicleNumber,
    this.gateName,
    this.photoUrl,
  });

  @override
  ConsumerState<DoorbellActionOverlayScreen> createState() =>
      _DoorbellActionOverlayScreenState();
}

class _DoorbellActionOverlayScreenState
    extends ConsumerState<DoorbellActionOverlayScreen> {
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    // Play custom brand doorbell ringtone on entrance
    DoorbellSoundService.instance.playDoorbellChime(loop: true);
  }

  @override
  void dispose() {
    DoorbellSoundService.instance.stop();
    super.dispose();
  }

  Future<void> _handleAction(String status, [String? notes]) async {
    if (_isProcessing) return;
    setState(() => _isProcessing = true);

    await DoorbellSoundService.instance.stop();

    final nowIso = DateTime.now().toIso8601String();
    try {
      final updateData = <String, dynamic>{
        'status': status,
        'updatedAt': FieldValue.serverTimestamp(),
      };
      if (status == 'approved') {
        updateData['approvedAt'] = nowIso;
      } else if (status == 'leave_at_gate') {
        updateData['leaveAtGateAt'] = nowIso;
        updateData['notes'] = notes ?? 'Resident instructed to leave delivery at guard desk';
      } else if (status == 'rejected') {
        updateData['rejectedAt'] = nowIso;
        updateData['rejectionReason'] = notes ?? 'Denied by resident';
      }

      await FirebaseFirestore.instance
          .doc('societies/${widget.societyId}/visitors/${widget.visitorId}')
          .update(updateData);
    } catch (e) {
      debugPrint('DoorbellActionOverlay error updating visitor status: $e');
    }

    if (mounted) {
      Navigator.of(context).maybePop();
    }
  }

  GateEntryType get _entryType {
    final type = widget.visitorType.toLowerCase();
    final comp = (widget.company ?? '').toLowerCase();
    if (type.contains('delivery') ||
        comp.contains('zomato') ||
        comp.contains('swiggy') ||
        comp.contains('amazon') ||
        comp.contains('blinkit') ||
        comp.contains('zepto') ||
        comp.contains('flipkart')) {
      return GateEntryType.delivery;
    }
    if (type.contains('cab') ||
        comp.contains('uber') ||
        comp.contains('ola') ||
        comp.contains('rapido')) {
      return GateEntryType.cab;
    }
    if (type.contains('service') || type.contains('help')) {
      return GateEntryType.service;
    }
    return GateEntryType.visitor;
  }

  String get _titleText {
    final loc = (widget.gateName != null && widget.gateName!.isNotEmpty)
        ? widget.gateName!
        : 'main gate';
    switch (_entryType) {
      case GateEntryType.delivery:
        return "You've got a Delivery at the $loc";
      case GateEntryType.cab:
        return "Your Cab has arrived at the $loc";
      case GateEntryType.service:
        return "Service Provider is at the $loc";
      case GateEntryType.visitor:
        return "You've got a Visitor at the $loc";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withValues(alpha: 0.75),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: GateEntryApprovalDialog(
              title: _titleText,
              visitorName: widget.visitorName,
              providerName: widget.company ?? widget.visitorType,
              avatarUrl: widget.photoUrl,
              gateName: widget.gateName ?? 'Gate 1 — Main Entry',
              temperatureText: '98.3°F',
              maskStatusText: 'Mask Verified',
              entryType: _entryType,
              onAllow: () => _handleAction('approved'),
              onLeaveAtGate: () => _handleAction(
                'leave_at_gate',
                'Resident instructed to leave delivery at guard desk',
              ),
              onDeny: () => _handleAction(
                'rejected',
                'Denied by resident',
              ),
            ),
          ),
        ),
      ),
    );
  }
}
