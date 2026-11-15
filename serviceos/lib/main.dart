import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/network/supabase_service.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Free Cloud Supabase (with graceful offline demo fixture fallback)
  await SupabaseService.instance.initialize();

  runApp(
    const ProviderScope(
      child: ServiceOSApp(),
    ),
  );
}

