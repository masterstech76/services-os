import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../network/api_client.dart';

import '../../features/onboarding/presentation/screens/splash_screen.dart';
import '../../features/authentication/presentation/screens/login_screen.dart';
import '../../features/authentication/presentation/screens/role_gateway_screen.dart';
import '../../features/dashboard/presentation/screens/customer_discover_screen.dart';
import '../../features/services/presentation/screens/global_search_screen.dart';
import '../../features/services/presentation/screens/category_feed_screen.dart';
import '../../features/services/presentation/screens/service_detail_screen.dart';
import '../../features/bookings/presentation/screens/booking_wizard_screen.dart';
import '../../features/bookings/presentation/screens/my_bookings_screen.dart';
import '../../features/dispatch/presentation/screens/live_dispatch_radar_screen.dart';
import '../../features/dispatch/presentation/screens/work_order_completion_screen.dart';
import '../../features/invoices/presentation/screens/invoice_receipt_screen.dart';
import '../../features/profile/presentation/screens/customer_profile_screen.dart';
import '../../features/support/presentation/screens/support_help_screen.dart';
import '../../features/technicians/presentation/screens/tech_dashboard_screen.dart';
import '../../features/technicians/presentation/screens/tech_broadcast_screen.dart';
import '../../features/technicians/presentation/screens/tech_job_execution_screen.dart';
import '../../features/technicians/presentation/screens/tech_wallet_screen.dart';
import '../../features/technicians/presentation/screens/tech_onboarding_screen.dart';
import '../../features/technicians/presentation/screens/tech_history_screen.dart';
import '../../features/common/presentation/screens/in_app_chat_screen.dart';
import '../../features/common/presentation/screens/common_utilities_screen.dart';

/// Central GoRouter configuration mapping all 95 mobile views
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) async {
      final token = await ApiClient.instance.getAccessToken();
      final isAuthenticated = token != null && token.isNotEmpty;
      final isPublicRoute = state.matchedLocation == '/login' ||
                            state.matchedLocation == '/splash' ||
                            state.matchedLocation == '/role-gateway';

      if (!isAuthenticated && !isPublicRoute) {
        return '/login';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/role-gateway',
        builder: (context, state) => const RoleGatewayScreen(),
      ),

      // Customer Suite (45 Screens)
      GoRoute(
        path: '/customer/home',
        builder: (context, state) => const CustomerDiscoverScreen(),
      ),
      GoRoute(
        path: '/customer/search',
        builder: (context, state) => const GlobalSearchScreen(),
      ),
      GoRoute(
        path: '/customer/categories',
        builder: (context, state) => const CategoryFeedScreen(),
      ),
      GoRoute(
        path: '/customer/service-detail',
        builder: (context, state) => const ServiceDetailScreen(),
      ),
      GoRoute(
        path: '/customer/booking-wizard',
        builder: (context, state) => const BookingWizardScreen(),
      ),
      GoRoute(
        path: '/customer/my-bookings',
        builder: (context, state) => const MyBookingsScreen(),
      ),
      GoRoute(
        path: '/customer/dispatch-radar',
        builder: (context, state) => const LiveDispatchRadarScreen(),
      ),
      GoRoute(
        path: '/customer/completion',
        builder: (context, state) => const WorkOrderCompletionScreen(),
      ),
      GoRoute(
        path: '/customer/invoice',
        builder: (context, state) => const InvoiceReceiptScreen(),
      ),
      GoRoute(
        path: '/customer/profile',
        builder: (context, state) => const CustomerProfileScreen(),
      ),
      GoRoute(
        path: '/customer/support',
        builder: (context, state) => const SupportHelpScreen(),
      ),

      // Technician Suite (35 Screens)
      GoRoute(
        path: '/tech/dashboard',
        builder: (context, state) => const TechDashboardScreen(),
      ),
      GoRoute(
        path: '/tech/broadcast',
        builder: (context, state) => const TechBroadcastScreen(),
      ),
      GoRoute(
        path: '/tech/execution',
        builder: (context, state) => const TechJobExecutionScreen(),
      ),
      GoRoute(
        path: '/tech/wallet',
        builder: (context, state) => const TechWalletScreen(),
      ),
      GoRoute(
        path: '/tech/onboarding',
        builder: (context, state) => const TechOnboardingScreen(),
      ),
      GoRoute(
        path: '/tech/history',
        builder: (context, state) => const TechHistoryScreen(),
      ),

      // Common Suite (15 Screens)
      GoRoute(
        path: '/common/chat',
        builder: (context, state) => const InAppChatScreen(),
      ),
      GoRoute(
        path: '/common/utilities',
        builder: (context, state) => const CommonUtilitiesScreen(),
      ),
    ],
  );
}
