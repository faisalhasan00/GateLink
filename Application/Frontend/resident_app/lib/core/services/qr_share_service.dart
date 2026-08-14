import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:image_picker/image_picker.dart';

/// Utility to capture a QR widget as an image and share it via the system share sheet.
class QrShareService {
  /// Shares a QR code pass with visitor details.
  ///
  /// [qrKey] is the GlobalKey attached to a RepaintBoundary wrapping the QR widget.
  /// [visitorName], [societyId], [flatNumber], [visitTime] are used for the text message.
  static Future<void> shareQrPass({
    required GlobalKey qrKey,
    required String visitorName,
    required String societyId,
    required String flatNumber,
    required String visitTime,
  }) async {
    try {
      // Capture QR widget as image
      final boundary =
          qrKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return;

      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return;

      final bytes = byteData.buffer.asUint8List();

      // Save to temp file
      final dir = await getTemporaryDirectory();
      final file = File(
          '${dir.path}/visitor_pass_${DateTime.now().millisecondsSinceEpoch}.png');
      await file.writeAsBytes(bytes);

      // Build share message
      final message = '''🏠 SocietySphere — Visitor Gate Pass

👤 Visitor: $visitorName
🏢 Society: $societyId
🚪 Flat: $flatNumber
🕐 Visit: $visitTime

Please show this QR code at the gate for quick entry.''';

      // Share via system share sheet
      await Share.shareXFiles(
        [XFile(file.path)],
        text: message,
        subject: 'Visitor Pass for $visitorName',
      );
    } catch (e) {
      debugPrint('QR Share error: $e');
    }
  }
}
