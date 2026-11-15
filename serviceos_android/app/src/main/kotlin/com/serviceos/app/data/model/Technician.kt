package com.serviceos.app.data.model

data class Technician(
    val id: String,
    val name: String,
    val tradeTitle: String,
    val licenseNumber: String,
    val rating: Double,
    val totalReviews: Int,
    val vehicleModel: String,
    val vehiclePlate: String,
    val avatarUrl: String,
    val isOnline: Boolean = true,
    val distanceMiles: Double = 2.4,
    val etaMinutes: Int = 12
)
