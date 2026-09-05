import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';

/// Micro-service responsible solely for Doorbell & Alert audio playback.
/// Encapsulates AudioPlayer lifecycle, looping, volume, and release.
class DoorbellSoundService {
  DoorbellSoundService._();
  static final DoorbellSoundService instance = DoorbellSoundService._();

  AudioPlayer? _player;
  bool _isPlaying = false;

  bool get isPlaying => _isPlaying;

  /// Plays the custom GateLink brand resident doorbell chime.
  Future<void> playDoorbellChime({bool loop = false}) async {
    try {
      await stop();
      _player = AudioPlayer();
      await _player!.setReleaseMode(loop ? ReleaseMode.loop : ReleaseMode.stop);
      await _player!.setVolume(1.0);
      await _player!.play(AssetSource('audio/resident_bell.wav'));
      _isPlaying = true;
      debugPrint('DoorbellSoundService: Playing resident_bell chime (loop: $loop)');

      _player!.onPlayerComplete.listen((_) {
        if (!loop) {
          _isPlaying = false;
        }
      });
    } catch (e) {
      debugPrint('DoorbellSoundService error playing chime: $e');
      _isPlaying = false;
    }
  }

  /// Stops and releases the audio player immediately.
  Future<void> stop() async {
    try {
      if (_player != null) {
        await _player!.stop();
        await _player!.dispose();
        _player = null;
      }
      _isPlaying = false;
      debugPrint('DoorbellSoundService: Audio stopped');
    } catch (e) {
      debugPrint('DoorbellSoundService error stopping audio: $e');
    }
  }
}
