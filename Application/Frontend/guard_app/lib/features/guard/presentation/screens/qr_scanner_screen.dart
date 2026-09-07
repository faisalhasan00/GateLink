import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../../domain/models/patrol_checkpoint_model.dart';
import '../../providers/patrol_providers.dart';
import '../widgets/helper_scan_modal.dart';
import '../widgets/manual_pass_lookup_dialog.dart';
import '../widgets/patrol_scan_success_modal.dart';
import '../widgets/qr_scanner_overlay.dart';
import '../widgets/visitor_pass_validation_modal.dart';

class QrScannerScreen extends ConsumerStatefulWidget {
  const QrScannerScreen({super.key});

  @override
  ConsumerState<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends ConsumerState<QrScannerScreen> {
  final MobileScannerController _controller = MobileScannerController();
  bool _isProcessing = false;
  bool _torchOn = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_isProcessing) return;
    for (final barcode in capture.barcodes) {
      if (barcode.rawValue != null && barcode.rawValue!.isNotEmpty) {
        setState(() => _isProcessing = true);
        HapticFeedback.vibrate();
        _processQrCode(barcode.rawValue!);
        break;
      }
    }
  }

  void _toggleTorch() {
    _controller.toggleTorch();
    setState(() => _torchOn = !_torchOn);
  }

  void _switchCamera() {
    _controller.switchCamera();
  }

  Future<void> _processQrCode(String code) async {
    // 1. Patrol Checkpoint QR Scan Check
    if (code.startsWith('gatelink://patrol') ||
        code.contains('type=patrol') ||
        code.contains('"type":"patrol"')) {
      await _handlePatrolScan(code);
      return;
    }

    try {
      final controller = ref.read(visitorControllerProvider.notifier);
      final result = await controller.validateAndProcessQrScan(code);

      if (!mounted) return;

      final bool isValid = result['valid'] == true;
      final String reason = result['reason'] as String? ?? 'invalid';
      final String? docId = result['docId'] as String?;
      final Map<String, dynamic> data =
          (result['data'] as Map<String, dynamic>?) ?? {};
      final String? scanType = result['type'] as String?;

      // Dedicated Domestic Staff & Helper Permanent Pass Modal
      if (scanType == 'helper') {
        HelperScanModal.show(
          context,
          data: data,
          helperId: docId ?? '',
          isValid: isValid,
          error: result['error'] as String?,
          onDismiss: () {
            if (mounted) setState(() => _isProcessing = false);
          },
        );
        return;
      }

      await VisitorPassValidationModal.show(
        context,
        code: code,
        isValid: isValid,
        reason: reason,
        docId: docId,
        data: data,
        error: result['error'] as String?,
        onAllowEntry: (id) => controller.approveVisitorEntry(id),
        onDenyEntry: (id) => controller.updateVisitorStatus(id, 'denied'),
        onMarkExit: (id) => controller.markVisitorExit(id),
      );
    } catch (e) {
      if (mounted) {
        await VisitorPassValidationModal.show(
          context,
          code: code,
          isValid: false,
          reason: 'error',
          docId: null,
          data: {},
          error: e.toString(),
          onAllowEntry: (_) async {},
          onDenyEntry: (_) async {},
          onMarkExit: (_) async {},
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Future<void> _handlePatrolScan(String rawCode) async {
    try {
      String checkpointId = '';
      String cpCode = 'CP-01';
      String cpName = 'Checkpoint';
      String cpArea = 'Society Grounds';
      String societyId = '';

      if (rawCode.startsWith('gatelink://patrol')) {
        final uri = Uri.parse(rawCode);
        checkpointId = uri.queryParameters['cid'] ??
            uri.queryParameters['checkpointId'] ??
            '';
        cpCode = uri.queryParameters['code'] ?? 'CP-01';
        cpName = uri.queryParameters['name'] ?? 'Patrol Checkpoint';
        cpArea = uri.queryParameters['area'] ?? 'Perimeter';
        societyId = uri.queryParameters['sid'] ??
            uri.queryParameters['societyId'] ??
            '';
      } else if (rawCode.startsWith('{')) {
        final parsed = jsonDecode(rawCode) as Map<String, dynamic>;
        checkpointId = parsed['cid'] as String? ??
            parsed['checkpointId'] as String? ??
            '';
        cpCode = parsed['code'] as String? ?? 'CP-01';
        cpName = parsed['name'] as String? ?? 'Patrol Checkpoint';
        cpArea = parsed['area'] as String? ?? 'Perimeter';
        societyId =
            parsed['sid'] as String? ?? parsed['societyId'] as String? ?? '';
      }

      final userProfile = ref.read(userProfileProvider).value;
      final authState = ref.read(authStateProvider).value;
      final effectiveSocId = societyId.isNotEmpty
          ? societyId
          : (userProfile?['societyId'] as String? ?? '');
      final guardUid = authState?.uid ?? '';
      final guardName =
          (userProfile?['name'] as String?) ?? 'Security Guard';

      final repo = ref.read(patrolRepositoryProvider);
      await repo.recordCheckpointScan(
        societyId: effectiveSocId,
        checkpointId: checkpointId.isNotEmpty
            ? checkpointId
            : 'cp_${cpCode.toLowerCase()}',
        checkpointCode: cpCode,
        checkpointName: cpName,
        checkpointArea: cpArea,
        guardUid: guardUid,
        guardName: guardName,
      );

      if (!mounted) return;
      await PatrolScanSuccessModal.show(
        context,
        checkpoint: PatrolCheckpointModel(
          id: checkpointId,
          code: cpCode,
          name: cpName,
          area: cpArea,
        ),
        guardName: guardName,
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Patrol scan error: $e'),
            backgroundColor: AppColors.error),
      );
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(
                _torchOn ? Icons.flash_on_rounded : Icons.flash_off_rounded),
            onPressed: _toggleTorch,
            tooltip: 'Toggle Flashlight',
          ),
          IconButton(
            icon: const Icon(Icons.flip_camera_android_rounded),
            onPressed: _switchCamera,
            tooltip: 'Switch Camera',
          ),
        ],
      ),
      body: Stack(
        alignment: Alignment.center,
        children: [
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
            errorBuilder: (context, error, child) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.camera_alt_rounded,
                        size: 56, color: Colors.white70),
                    const SizedBox(height: 16),
                    const Text(
                      'Camera Access / Permission Required',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Error: ${error.errorCode}',
                      style:
                          const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () => _controller.start(),
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Start Camera Scanner'),
                    ),
                  ],
                ),
              );
            },
          ),
          QrScannerOverlay(
            onManualEntryPressed: () {
              ManualPassLookupDialog.show(
                context,
                onLookup: (code) {
                  setState(() => _isProcessing = true);
                  _processQrCode(code);
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
