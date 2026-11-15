package com.serviceos.app.core.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

data class ServiceOSExtraColors(
    val border: Color,
    val rating: Color,
    val verified: Color,
    val warning: Color,
    val heroGradientStart: Color,
    val heroGradientEnd: Color
)

val LocalExtraColors = staticCompositionLocalOf {
    ServiceOSExtraColors(
        border = DayBorder,
        rating = RatingAmber,
        verified = VerifiedEmerald,
        warning = WarningOrange,
        heroGradientStart = Color(0xFFEEF2FF),
        heroGradientEnd = Color(0xFFEDE9FE)
    )
}

private val DayColorScheme = lightColorScheme(
    primary = DayPrimary,
    secondary = DayAccent,
    background = DayCanvas,
    surface = DaySurface,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = DayTextPrimary,
    onSurface = DayTextPrimary,
    outline = DayBorder
)

private val NightColorScheme = darkColorScheme(
    primary = NightPrimary,
    secondary = NightAccent,
    background = NightCanvas,
    surface = NightSurface,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = NightTextPrimary,
    onSurface = NightTextPrimary,
    outline = NightBorder
)

@Composable
fun ServiceOSTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) NightColorScheme else DayColorScheme
    val extraColors = if (darkTheme) {
        ServiceOSExtraColors(
            border = NightBorder,
            rating = RatingAmber,
            verified = VerifiedEmerald,
            warning = WarningOrange,
            heroGradientStart = Color(0xFF0F172A),
            heroGradientEnd = Color(0xFF1E1B4B)
        )
    } else {
        ServiceOSExtraColors(
            border = DayBorder,
            rating = RatingAmber,
            verified = VerifiedEmerald,
            warning = WarningOrange,
            heroGradientStart = Color(0xFFEEF2FF),
            heroGradientEnd = Color(0xFFEDE9FE)
        )
    }

    CompositionLocalProvider(LocalExtraColors provides extraColors) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = Typography,
            content = content
        )
    }
}
