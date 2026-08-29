import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../widgets/helper_scan_modal.dart';

class QrScannerScreen extends ConsumerStatefulWidget {
  const QrScannerScreen({super.key});

  @override
  ConsumerState<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends ConsumerState<QrScannerScreen> {
  final MobileScannerController _controller = MobileScannerController();
  bool _isProcessing = false;
  bool _torchOn = false;
  final _manualCodeController = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    _manualCodeController.dispose();
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
    try {
      final controller = ref.read(visitorControllerProvider.notifier);
      final result = await controller.validateAndProcessQrScan(code);

      if (!mounted) return;

      final bool isValid = result['valid'] == true;
      final String reason = result['reason'] as String? ?? 'invalid';
      final String? docId = result['docId'] as String?;
      final Map<String, dynamic> data = (result['data'] as Map<String, dynamic>?) ?? {};
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

      _showValidationModal(
        code: code,
        isValid: isValid,
        reason: reason,
        docId: docId,
        data: data,
        error: result['error'] as String?,
      );
    } catch (e) {
      if (mounted) {
        _showValidationModal(
          code: code,
          isValid: false,
          reason: 'error',
          docId: null,
          data: {},
          error: e.toString(),
        );
      }
    }
  }

  Future<void> _allowEntry(String docId) async {
    final controller = ref.read(visitorControllerProvider.notifier);
    await controller.approveVisitorEntry(docId);
  }

  Future<void> _denyEntry(String docId) async {
    final controller = ref.read(visitorControllerProvider.notifier);
    await controller.updateVisitorStatus(docId, 'denied');
  }

  Future<void> _markExit(String docId) async {
    final controller = ref.read(visitorControllerProvider.notifier);
    await controller.markVisitorExit(docId);
  }

  void _showValidationModal({
    required String code,
    required bool isValid,
    required String reason,
    required String? docId,
    required Map<String, dynamic> data,
    String? error,
  }) {
    final isAlreadyUsed = reason == 'already_used';
    final isExpired = reason == 'expired';

    String headerTitle = 'PASS VERIFIED ✅';
    String headerSub = 'Pre-approved visitor pass verified for gate entry.';
    Color primaryColor = AppColors.success;
    IconData statusIcon = Icons.verified_rounded;

    if (isAlreadyUsed) {
      headerTitle = 'ALREADY USED ❌';
      headerSub = 'This pass has already been used for entry.';
      primaryColor = AppColors.error;
      statusIcon = Icons.cancel_rounded;
      HapticFeedback.heavyImpact();
    } else if (isExpired) {
      headerTitle = 'QR CODE EXPIRED ❌';
      headerSub = 'Pass expiration date & time has passed.';
      primaryColor = AppColors.error;
      statusIcon = Icons.timer_off_rounded;
      HapticFeedback.heavyImpact();
    } else if (!isValid) {
      headerTitle = 'INVALID QR CODE ❌';
      headerSub = error ?? 'QR code is not recognised or corrupted.';
      primaryColor = AppColors.error;
      statusIcon = Icons.error_rounded;
      HapticFeedback.heavyImpact();
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg,
          AppSpacing.md,
          AppSpacing.lg,
          AppSpacing.xl,
        ),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xxl)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.gray300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            CircleAvatar(
              radius: 32,
              backgroundColor: primaryColor.withValues(alpha: 0.15),
              child: Icon(statusIcon, color: primaryColor, size: 38),
            ),
            const SizedBox(height: AppSpacing.sm),

            Text(
              headerTitle,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: primaryColor,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              headerSub,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: AppSpacing.md),
            const Divider(),
            const SizedBox(height: AppSpacing.sm),

            if (data.isNotEmpty) ...[
              _ModalInfoRow(label: 'Visitor Name', value: data['name'] as String? ?? '-'),
              _ModalInfoRow(label: 'Destination Flat', value: data['hostFlat'] as String? ?? '-'),
              _ModalInfoRow(label: 'Visitor Type', value: data['type'] as String? ?? 'Guest'),
              _ModalInfoRow(label: 'Current Status', value: (data['status'] as String? ?? 'pending').toUpperCase()),
              _ModalInfoRow(label: 'Pass Code', value: code.length > 18 ? '${code.substring(0, 18)}...' : code),
            ] else ...[
              _ModalInfoRow(label: 'Scanned Code', value: code.length > 22 ? '${code.substring(0, 22)}...' : code),
            ],
            const SizedBox(height: AppSpacing.lg),

            Row(
              children: [
                if (isAlreadyUsed && docId != null)
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        final nav = Navigator.of(ctx);
                        final messenger = ScaffoldMessenger.of(context);
                        await _markExit(docId);
                        nav.pop();
                        setState(() => _isProcessing = false);
                        messenger.showSnackBar(
                          const SnackBar(
                            content: Text('✅ Visitor marked as checked out at gate!'),
                            backgroundColor: AppColors.secondary,
                          ),
                        );
                      },
                      icon: const Icon(Icons.exit_to_app_rounded),
                      label: const Text('MARK VISITOR EXIT'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.secondary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                      ),
                    ),
                  )
                else if (isValid && docId != null) ...[
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () async {
                        final nav = Navigator.of(ctx);
                        await _denyEntry(docId);
                        nav.pop();
                        setState(() => _isProcessing = false);
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                      ),
                      child: const Text('Deny Entry'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        final nav = Navigator.of(ctx);
                        final messenger = ScaffoldMessenger.of(context);
                        await _allowEntry(docId);
                        nav.pop();
                        setState(() => _isProcessing = false);
                        messenger.showSnackBar(
                          const SnackBar(
                            content: Text('✅ Visitor allowed entry at Gate!'),
                            backgroundColor: AppColors.success,
                          ),
                        );
                      },
                      icon: const Icon(Icons.how_to_reg_rounded),
                      label: const Text('ALLOW ENTRY'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.success,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                      ),
                    ),
                  ),
                ] else
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(ctx).pop();
                        setState(() => _isProcessing = false);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.gray400,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('CLOSE'),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    ).then((_) {
      if (mounted) setState(() => _isProcessing = false);
    });
  }

  void _showManualEntryDialog() {
    _manualCodeController.clear();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
        title: const Text('Manual Pass Lookup', style: TextStyle(fontWeight: FontWeight.w700)),
        content: TextField(
          controller: _manualCodeController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Enter Pass Code or Doc ID',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final code = _manualCodeController.text.trim();
              if (code.isNotEmpty) {
                Navigator.pop(ctx);
                setState(() => _isProcessing = true);
                _processQrCode(code);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.secondary,
              foregroundColor: Colors.white,
            ),
            child: const Text('Lookup Pass'),
          ),
        ],
      ),
    );
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
            icon: Icon(_torchOn ? Icons.flash_on_rounded : Icons.flash_off_rounded),
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
                    const Icon(Icons.camera_alt_rounded, size: 56, color: Colors.white70),
                    const SizedBox(height: 16),
                    const Text(
                      'Camera Access / Permission Required',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Error: ${error.errorCode}',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
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
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.45),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Container(
                      width: 260,
                      height: 260,
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.primary, width: 3),
                        borderRadius: BorderRadius.circular(AppRadius.xl),
                        color: Colors.transparent,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 40,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Align Visitor QR Code within frame',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ),
          Positioned(
            bottom: 40,
            child: ElevatedButton.icon(
              onPressed: _showManualEntryDialog,
              icon: const Icon(Icons.keyboard_rounded),
              label: const Text('Enter Pass Code Manually'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.secondary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.full)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ModalInfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _ModalInfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}
