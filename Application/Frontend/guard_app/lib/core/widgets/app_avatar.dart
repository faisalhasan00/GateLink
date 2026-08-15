import 'dart:convert';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

enum AppAvatarSize {
  xs(28),
  sm(36),
  md(48),
  lg(64),
  xl(84),
  xxl(104);

  final double diameter;
  const AppAvatarSize(this.diameter);
}

class AppAvatar extends StatelessWidget {
  final String? imageUrl;
  final String name;
  final AppAvatarSize size;
  final Color? backgroundColor;
  final Color? textColor;
  final bool showBorder;
  final Color borderColor;
  final bool isOnline;
  final bool showOnlineIndicator;
  final bool isEditable;
  final VoidCallback? onEditTap;
  final VoidCallback? onTap;

  const AppAvatar({
    super.key,
    this.imageUrl,
    this.name = '',
    this.size = AppAvatarSize.md,
    this.backgroundColor,
    this.textColor,
    this.showBorder = false,
    this.borderColor = Colors.white,
    this.isOnline = false,
    this.showOnlineIndicator = false,
    this.isEditable = false,
    this.onEditTap,
    this.onTap,
  });

  String get _initials {
    if (name.trim().isEmpty) return 'G';
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final diameter = size.diameter;
    final fontSize = diameter * 0.4;

    Widget avatarContent;

    if (imageUrl != null && imageUrl!.trim().isNotEmpty) {
      final url = imageUrl!.trim();
      if (url.startsWith('data:image') || url.startsWith('data:application')) {
        try {
          final base64Data = url.split(',').last;
          final bytes = base64Decode(base64Data);
          avatarContent = ClipOval(
            child: Image.memory(
              bytes,
              width: diameter,
              height: diameter,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => _buildInitials(fontSize),
            ),
          );
        } catch (_) {
          avatarContent = _buildInitials(fontSize);
        }
      } else {
        avatarContent = ClipOval(
          child: Image.network(
            url,
            width: diameter,
            height: diameter,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => _buildInitials(fontSize),
            loadingBuilder: (context, child, progress) {
              if (progress == null) return child;
              return Container(
                width: diameter,
                height: diameter,
                color: AppColors.primarySurface,
                child: const Center(
                  child: SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ),
              );
            },
          ),
        );
      }
    } else {
      avatarContent = _buildInitials(fontSize);
    }

    Widget mainWidget = Container(
      width: diameter,
      height: diameter,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: showBorder ? Border.all(color: borderColor, width: 2.5) : null,
      ),
      child: avatarContent,
    );

    if (onTap != null) {
      mainWidget = GestureDetector(onTap: onTap, child: mainWidget);
    }

    if (!showOnlineIndicator && !isEditable) {
      return mainWidget;
    }

    return Stack(
      clipBehavior: Clip.none,
      children: [
        mainWidget,
        if (showOnlineIndicator)
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              width: diameter * 0.28,
              height: diameter * 0.28,
              decoration: BoxDecoration(
                color: isOnline ? AppColors.success : AppColors.textDisabled,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ),
        if (isEditable)
          Positioned(
            right: 0,
            bottom: 0,
            child: GestureDetector(
              onTap: onEditTap,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.camera_alt_rounded,
                  size: diameter * 0.24,
                  color: Colors.white,
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildInitials(double fontSize) {
    return Container(
      width: size.diameter,
      height: size.diameter,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.primarySurface,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        _initials,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.w800,
          color: textColor ?? AppColors.primary,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
