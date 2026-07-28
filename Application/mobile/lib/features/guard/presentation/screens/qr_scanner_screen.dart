import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
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
      if (barcode.rawValue != null) {
        setState(() => _isProcessing = true);
        _lookupAndShowModal(barcode.rawValue!);
        break;
      }
    }
  }

  void _toggleTorch() {
    _controller.toggleTorch();
    setState(() => _torchOn = !_torchOn);
  }

  /// Looks up QR code in Firestore visitors (qrCode field) or uses it as docId
  Future<void> _lookupAndShowModal(String code) async {
    try {
      // Try looking up by qrCode field first
      final query = await FirebaseFirestore.instance
          .collection('societies/SOC-001/visitors')
          .where('qrCode', isEqualTo: code)
          .limit(1)
          .get();

      Map<String, dynamic>? visitorData;
      String? docId;

      if (query.docs.isNotEmpty) {
        visitorData = query.docs.first.data();
        docId = query.docs.first.id;
      } else {
        // Try as docId directly
        final doc = await FirebaseFirestore.instance
            .doc('societies/SOC-001/visitors/$code')
            .get();
        if (doc.exists) {
          visitorData = doc.data();
          docId = doc.id;
        }
      }

      if (!mounted) return;

      if (visitorData != null && docId != null) {
        _showValidationModal(code: code, data: visitorData, docId: docId, found: true);
      } else {
        _showValidationModal(code: code, data: {}, docId: null, found: false);
      }
    } catch (e) {
      if (mounted) {
        _showValidationModal(code: code, data: {}, docId: null, found: false, error: e.toString());
      }
    }
  }

  Future<void> _allowEntry(String docId) async {
    await FirebaseFirestore.instance.doc('societies/SOC-001/visitors/$docId').update({
      'status': 'inside',
      'entryTime': DateTime.now().toIso8601String(),
    });
  }

  Future<void> _denyEntry(String docId) async {
    await FirebaseFirestore.instance.doc('societies/SOC-001/visitors/$docId').update({
      'status': 'denied',
    });
  }

  void _showValidationModal({
    required String code,
    required Map<String, dynamic> data,
    required String? docId,
    required bool found,
    String? error,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
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
            // Handle
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.gray300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Status Icon
            CircleAvatar(
              radius: 32,
              backgroundColor: found ? AppColors.successSurface : AppColors.errorSurface,
              child: Icon(
                found && data['status'] != 'inside' && data['status'] != 'denied' ? Icons.verified_rounded : Icons.cancel_rounded,
                color: found && data['status'] != 'inside' && data['status'] != 'denied' ? AppColors.success : AppColors.error,
                size: 36,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              found 
                ? (data['status'] == 'inside' ? 'PASS ALREADY USED ❌' : (data['status'] == 'denied' ? 'PASS DENIED ❌' : 'PASS VERIFIED ✅'))
                : 'PASS NOT FOUND ❌',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: found && data['status'] != 'inside' && data['status'] != 'denied' ? AppColors.success : AppColors.error,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              found 
                ? (data['status'] == 'inside' ? 'This visitor is already inside.' : (data['status'] == 'denied' ? 'This visitor was denied entry.' : 'Pre-approved visitor pass'))
                : error ?? 'QR code not recognised',
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: AppSpacing.md),
            const Divider(),
            const SizedBox(height: AppSpacing.sm),

            // Visitor Details
            if (found) ...[
              _ModalInfoRow(label: 'Visitor Name', value: data['name'] as String? ?? '-'),
              _ModalInfoRow(label: 'Visiting Flat', value: data['hostFlat'] as String? ?? '-'),
              _ModalInfoRow(label: 'Type', value: data['type'] as String? ?? 'Guest'),
              _ModalInfoRow(
                label: 'Status',
                value: (data['status'] as String? ?? 'pending').toUpperCase(),
              ),
              _ModalInfoRow(label: 'Pass Code', value: code.length > 16 ? '${code.substring(0, 16)}...' : code),
            ] else ...[
              _ModalInfoRow(label: 'Scanned Code', value: code.length > 20 ? '${code.substring(0, 20)}...' : code),
            ],
            const SizedBox(height: AppSpacing.lg),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () async {
                      // Capture navigator before async gap
                      final nav = Navigator.of(context);
                      if (found && docId != null) await _denyEntry(docId);
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
                    onPressed: found && docId != null && data['status'] != 'inside' && data['status'] != 'denied'
                        ? () async {
                            // Capture messenger and navigator before async gap
                            final nav = Navigator.of(context);
                            final messenger = ScaffoldMessenger.of(context);
                            await _allowEntry(docId);
                            nav.pop();
                            setState(() => _isProcessing = false);
                            messenger.showSnackBar(
                              const SnackBar(
                                content: Text('✅ Visitor allowed at Gate 1!'),
                                backgroundColor: AppColors.success,
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                        : null,
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
              ],
            ),
          ],
        ),
      ),
    ).then((_) => setState(() => _isProcessing = false));
  }

  void _showManualEntryDialog() {
    _manualCodeController.clear();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
        title: const Text('Enter Pass Code', style: TextStyle(fontWeight: FontWeight.w700)),
        content: TextField(
          controller: _manualCodeController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'e.g. PASS-8921 or Firestore doc ID',
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
              Navigator.pop(ctx);
              if (code.isNotEmpty) {
                setState(() => _isProcessing = true);
                _lookupAndShowModal(code);
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
            child: const Text('Verify'),
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
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text(
          'Scan Visitor QR Pass',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        actions: [
          IconButton(
            tooltip: 'Toggle Torch',
            icon: Icon(
              _torchOn ? Icons.flash_on_rounded : Icons.flash_off_rounded,
              color: _torchOn ? Colors.yellow : Colors.white70,
            ),
            onPressed: _toggleTorch,
          ),
          IconButton(
            tooltip: 'Flip Camera',
            icon: const Icon(Icons.cameraswitch_rounded),
            onPressed: () => _controller.switchCamera(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Full screen camera view
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),

          // Dark gradient overlay at top
          Container(
            height: 120,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.black.withValues(alpha: 0.6), Colors.transparent],
              ),
            ),
          ),

          // Scanning Frame Target
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 260,
                  height: 260,
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.primary, width: 2.5),
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                ..._buildCornerMarkers(),
                if (_isProcessing)
                  Container(
                    width: 260,
                    height: 260,
                    decoration: BoxDecoration(
                      color: AppColors.success.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Center(
                      child: CircularProgressIndicator(color: AppColors.success),
                    ),
                  ),
              ],
            ),
          ),

          // Instruction label
          Positioned(
            bottom: 120,
            left: 0,
            right: 0,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(
                    _isProcessing ? 'QR Code detected! Verifying...' : 'Position visitor QR pass within the frame',
                    style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                ),
              ],
            ),
          ),

          // Manual Entry Panel at bottom
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.secondary.withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(AppRadius.xl),
              ),
              child: Row(
                children: [
                  const Icon(Icons.keyboard_rounded, color: Colors.white70, size: 20),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      "Can't scan? Enter pass code manually",
                      style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: _showManualEntryDialog,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(90, 32),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                      textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                    child: const Text('Enter Code'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildCornerMarkers() {
    const size = 24.0;
    const thickness = 3.0;
    const color = AppColors.primary;
    const offset = 129.0;

    return [
      // Top-left
      Positioned(top: offset - size, left: offset - size,
        child: Container(width: size, height: thickness, color: color)),
      Positioned(top: offset - size, left: offset - size,
        child: Container(width: thickness, height: size, color: color)),
      // Top-right
      Positioned(top: offset - size, right: offset - size,
        child: Container(width: size, height: thickness, color: color)),
      Positioned(top: offset - size, right: offset - size,
        child: Container(width: thickness, height: size, color: color)),
      // Bottom-left
      Positioned(bottom: offset - size, left: offset - size,
        child: Container(width: size, height: thickness, color: color)),
      Positioned(bottom: offset - size, left: offset - size,
        child: Container(width: thickness, height: size, color: color)),
      // Bottom-right
      Positioned(bottom: offset - size, right: offset - size,
        child: Container(width: size, height: thickness, color: color)),
      Positioned(bottom: offset - size, right: offset - size,
        child: Container(width: thickness, height: size, color: color)),
    ];
  }
}

class _ModalInfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _ModalInfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const Spacer(),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}
