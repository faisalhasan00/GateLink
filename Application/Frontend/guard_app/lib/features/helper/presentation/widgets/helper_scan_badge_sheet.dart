import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class HelperScanBadgeSheet extends StatelessWidget {
  final ValueChanged<String> onHelperIdScanned;

  const HelperScanBadgeSheet({
    super.key,
    required this.onHelperIdScanned,
  });

  static void show(BuildContext context,
      {required ValueChanged<String> onHelperIdScanned}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.black,
      builder: (ctx) => HelperScanBadgeSheet(
        onHelperIdScanned: onHelperIdScanned,
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
        title: const Text('Scan Staff ID Badge'),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Stack(
        children: [
          MobileScanner(
            onDetect: (capture) {
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                final rawValue = barcode.rawValue ?? '';
                if (rawValue.startsWith('GATELINK:HELPER:')) {
                  final parts = rawValue.split(':');
                  if (parts.length >= 4) {
                    final helperId = parts[3];
                    Navigator.pop(context);
                    onHelperIdScanned(helperId);
                    break;
                  }
                }
              }
            },
          ),
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFF0EA5E9), width: 3),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.75),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                'Point camera at Domestic Staff QR Badge on phone or ID card',
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
