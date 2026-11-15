import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Configuration credentials for Cloud Supabase
class SupabaseConfig {
  /// Supabase project URL (provided via --dart-define=SUPABASE_URL=...)
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: '',
  );

  /// Supabase public anon key (provided via --dart-define=SUPABASE_ANON_KEY=...)
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: '',
  );
}

/// ServiceOS Supabase Network & Realtime Service
class SupabaseService {
  static SupabaseService? _instance;
  static SupabaseService get instance => _instance ??= SupabaseService._();

  SupabaseClient? _client;
  bool _isInitialized = false;
  bool _isLiveConnected = false;

  SupabaseService._();

  /// Whether Supabase is connected to a live cloud instance
  bool get isLiveConnected => _isLiveConnected;

  /// Active Supabase Client instance (null in pure offline demo mode)
  SupabaseClient? get client => _client;

  /// Initialize Supabase connection with graceful offline fallback
  Future<void> initialize({
    String url = SupabaseConfig.supabaseUrl,
    String anonKey = SupabaseConfig.supabaseAnonKey,
  }) async {
    if (_isInitialized) return;

    try {
      if (url.isEmpty || anonKey.isEmpty || !url.startsWith('http')) {
        // Running in local catalogue mode until cloud credentials are provided
        _isInitialized = true;
        _isLiveConnected = false;
        debugPrint('[SupabaseService] Running in offline catalogue mode (no live Supabase URL configured)');
        return;
      }

      await Supabase.initialize(
        url: url,
        anonKey: anonKey,
        debug: kDebugMode,
      );

      _client = Supabase.instance.client;
      _isInitialized = true;
      _isLiveConnected = true;
      debugPrint('[SupabaseService] Successfully connected to Live Cloud Supabase ($url)');
    } catch (e) {
      _isInitialized = true;
      _isLiveConnected = false;
      debugPrint('[SupabaseService] Connection error: $e. Gracefully falling back to external demo fixtures.');
    }
  }

  /// Current authenticated Supabase user or null
  User? get currentUser => _client?.auth.currentUser;

  /// Sign out active session
  Future<void> signOut() async {
    try {
      await _client?.auth.signOut();
    } catch (e) {
      debugPrint('[SupabaseService] Sign out error: $e');
    }
  }
}
