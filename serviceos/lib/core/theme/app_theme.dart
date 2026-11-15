import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// ServiceOS Design System Tokens
class AppColors {
  // Day Vision (Light Mode — Default matching reference image)
  static const Color dayCanvas = Color(0xFFF8FAFC);
  static const Color daySurface = Color(0xFFFFFFFF);
  static const Color dayPrimary = Color(0xFF6366F1); // Royal Indigo
  static const Color dayAccent = Color(0xFF7C3AED);  // Vivid Violet
  static const Color dayTextPrimary = Color(0xFF0F172A);
  static const Color dayTextSecondary = Color(0xFF475569);
  static const Color dayBorder = Color(0xFFE2E8F0);
  
  // Night Vision (Dark Mode — OLED)
  static const Color nightCanvas = Color(0xFF060B14);
  static const Color nightSurface = Color(0xFF0C1523);
  static const Color nightPrimary = Color(0xFF818CF8);
  static const Color nightAccent = Color(0xFFA78BFA);
  static const Color nightTextPrimary = Color(0xFFF8FAFC);
  static const Color nightTextSecondary = Color(0xFF94A3B8);
  static const Color nightBorder = Color(0x1AFFFFFF);

  // Status Badges & Accents (Shared)
  static const Color ratingAmber = Color(0xFFF59E0B);
  static const Color verifiedEmerald = Color(0xFF10B981);
  static const Color errorRed = Color(0xFFEF4444);
  static const Color warningOrange = Color(0xFFF97316);
}

class AppTheme {
  /// Day Vision Theme (Primary Default)
  static ThemeData get dayTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.dayCanvas,
      primaryColor: AppColors.dayPrimary,
      colorScheme: const ColorScheme.light(
        primary: AppColors.dayPrimary,
        secondary: AppColors.dayAccent,
        surface: AppColors.daySurface,
        onSurface: AppColors.dayTextPrimary,
        outline: AppColors.dayBorder,
      ),
      cardTheme: CardTheme(
        color: AppColors.daySurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.dayBorder, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.dayPrimary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w800,
            fontSize: 14,
            letterSpacing: -0.2,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.dayPrimary,
          side: const BorderSide(color: AppColors.dayBorder, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.dayPrimary,
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            fontSize: 13,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.daySurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.dayBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.dayBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.dayPrimary, width: 2),
        ),
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme).apply(
        bodyColor: AppColors.dayTextPrimary,
        displayColor: AppColors.dayTextPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.daySurface,
        elevation: 0,
        scrolledUnderElevation: 0,
        foregroundColor: AppColors.dayTextPrimary,
        iconTheme: IconThemeData(color: AppColors.dayTextPrimary),
      ),
    );
  }

  /// Night Vision Theme (OLED Dark Mode)
  static ThemeData get nightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.nightCanvas,
      primaryColor: AppColors.nightPrimary,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.nightPrimary,
        secondary: AppColors.nightAccent,
        surface: AppColors.nightSurface,
        onSurface: AppColors.nightTextPrimary,
        outline: AppColors.nightBorder,
      ),
      cardTheme: CardTheme(
        color: AppColors.nightSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.nightBorder, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.nightPrimary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w800,
            fontSize: 14,
            letterSpacing: -0.2,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.nightPrimary,
          side: const BorderSide(color: AppColors.nightBorder, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.nightPrimary,
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            fontSize: 13,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.nightSurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.nightBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.nightBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.nightPrimary, width: 2),
        ),
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme).apply(
        bodyColor: AppColors.nightTextPrimary,
        displayColor: AppColors.nightTextPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.nightSurface,
        elevation: 0,
        scrolledUnderElevation: 0,
        foregroundColor: AppColors.nightTextPrimary,
        iconTheme: IconThemeData(color: AppColors.nightTextPrimary),
      ),
    );
  }
}

