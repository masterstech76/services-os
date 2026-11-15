package com.serviceos.app.core.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.serviceos.app.ui.common.*
import com.serviceos.app.ui.customer.*
import com.serviceos.app.ui.technician.*

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object RoleGateway : Screen("role_gateway")
    
    // Customer
    object CustomerHome : Screen("customer_home")
    object CustomerSearch : Screen("customer_search")
    object CustomerCategoryFeed : Screen("customer_category_feed")
    object CustomerServiceDetail : Screen("customer_service_detail")
    object CustomerBookingWizard : Screen("customer_booking_wizard")
    object CustomerDispatchRadar : Screen("customer_dispatch_radar")
    object CustomerCompletion : Screen("customer_completion")
    object CustomerMyBookings : Screen("customer_my_bookings")
    object CustomerInvoice : Screen("customer_invoice")
    object CustomerProfile : Screen("customer_profile")
    object CustomerSupport : Screen("customer_support")

    // Technician
    object TechDashboard : Screen("tech_dashboard")
    object TechBroadcast : Screen("tech_broadcast")
    object TechJobExecution : Screen("tech_job_execution")
    object TechWallet : Screen("tech_wallet")
    object TechOnboarding : Screen("tech_onboarding")
    object TechHistory : Screen("tech_history")

    // Common
    object InAppChat : Screen("in_app_chat")
    object CommonUtilities : Screen("common_utilities")
}

@Composable
fun ServiceOSNavHost(
    navController: NavHostController,
    onThemeToggle: () -> Unit = {}
) {
    NavHost(
        navController = navController,
        startDestination = Screen.CustomerHome.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onGetStarted = { navController.navigate(Screen.Login.route) }
            )
        }
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = { navController.navigate(Screen.RoleGateway.route) }
            )
        }
        composable(Screen.RoleGateway.route) {
            RoleGatewayScreen(
                onSelectCustomer = { navController.navigate(Screen.CustomerHome.route) },
                onSelectTechnician = { navController.navigate(Screen.TechDashboard.route) }
            )
        }

        // Customer Suite
        composable(Screen.CustomerHome.route) {
            CustomerDiscoverScreen(
                onThemeToggle = onThemeToggle,
                onSearchClick = { navController.navigate(Screen.CustomerSearch.route) },
                onCategoryClick = { navController.navigate(Screen.CustomerCategoryFeed.route) },
                onServiceClick = { navController.navigate(Screen.CustomerServiceDetail.route) },
                onBookService = { navController.navigate(Screen.CustomerBookingWizard.route) }
            )
        }
        composable(Screen.CustomerSearch.route) {
            GlobalSearchScreen(
                onBack = { navController.popBackStack() },
                onServiceClick = { navController.navigate(Screen.CustomerServiceDetail.route) }
            )
        }
        composable(Screen.CustomerCategoryFeed.route) {
            CategoryFeedScreen(
                onBack = { navController.popBackStack() },
                onServiceClick = { navController.navigate(Screen.CustomerServiceDetail.route) }
            )
        }
        composable(Screen.CustomerServiceDetail.route) {
            ServiceDetailScreen(
                onBack = { navController.popBackStack() },
                onBookNow = { navController.navigate(Screen.CustomerBookingWizard.route) }
            )
        }
        composable(Screen.CustomerBookingWizard.route) {
            BookingWizardScreen(
                onBack = { navController.popBackStack() },
                onConfirmed = { navController.navigate(Screen.CustomerDispatchRadar.route) }
            )
        }
        composable(Screen.CustomerDispatchRadar.route) {
            LiveDispatchRadarScreen(
                onBack = { navController.popBackStack() },
                onChatClick = { navController.navigate(Screen.InAppChat.route) },
                onCompleteClick = { navController.navigate(Screen.CustomerCompletion.route) }
            )
        }
        composable(Screen.CustomerCompletion.route) {
            WorkOrderCompletionScreen(
                onBack = { navController.popBackStack() },
                onFinish = { navController.navigate(Screen.CustomerInvoice.route) }
            )
        }
        composable(Screen.CustomerMyBookings.route) {
            MyBookingsScreen(
                onBack = { navController.popBackStack() },
                onTrackLive = { navController.navigate(Screen.CustomerDispatchRadar.route) },
                onViewInvoice = { navController.navigate(Screen.CustomerInvoice.route) }
            )
        }
        composable(Screen.CustomerInvoice.route) {
            InvoiceReceiptScreen(
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.CustomerProfile.route) {
            CustomerProfileScreen(
                onBack = { navController.popBackStack() },
                onThemeToggle = onThemeToggle,
                onLogout = { navController.navigate(Screen.Login.route) }
            )
        }
        composable(Screen.CustomerSupport.route) {
            SupportHelpScreen(
                onBack = { navController.popBackStack() }
            )
        }

        // Technician Suite
        composable(Screen.TechDashboard.route) {
            TechDashboardScreen(
                onThemeToggle = onThemeToggle,
                onSimulateBroadcast = { navController.navigate(Screen.TechBroadcast.route) },
                onOpenWallet = { navController.navigate(Screen.TechWallet.route) },
                onOpenHistory = { navController.navigate(Screen.TechHistory.route) },
                onOpenOnboarding = { navController.navigate(Screen.TechOnboarding.route) }
            )
        }
        composable(Screen.TechBroadcast.route) {
            TechBroadcastScreen(
                onAccept = { navController.navigate(Screen.TechJobExecution.route) },
                onDecline = { navController.popBackStack() }
            )
        }
        composable(Screen.TechJobExecution.route) {
            TechJobExecutionScreen(
                onJobCompleted = { navController.navigate(Screen.TechWallet.route) },
                onOpenChat = { navController.navigate(Screen.InAppChat.route) }
            )
        }
        composable(Screen.TechWallet.route) {
            TechWalletScreen(
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.TechOnboarding.route) {
            TechOnboardingScreen(
                onBack = { navController.popBackStack() },
                onFinish = { navController.navigate(Screen.TechDashboard.route) }
            )
        }
        composable(Screen.TechHistory.route) {
            TechHistoryScreen(
                onBack = { navController.popBackStack() }
            )
        }

        // Common Suite
        composable(Screen.InAppChat.route) {
            InAppChatScreen(
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.CommonUtilities.route) {
            CommonUtilitiesScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
