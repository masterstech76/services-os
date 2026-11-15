package com.serviceos.app.data.model

data class ServiceCategory(
    val id: String,
    val name: String,
    val iconEmoji: String,
    val isEmergencyEligible: Boolean = false
)

data class ServiceItem(
    val id: String,
    val title: String,
    val categoryId: String,
    val basePrice: Double,
    val durationMinutes: Int,
    val rating: Double = 4.8,
    val reviewCount: Int = 120,
    val imageUrl: String,
    val isVerifiedPro: Boolean = true
)
