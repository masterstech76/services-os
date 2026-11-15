package com.serviceos.app.data.repository

import com.serviceos.app.data.model.ServiceCategory
import com.serviceos.app.data.model.ServiceItem

object ServiceRepository {
    val categories = listOf(
        ServiceCategory("plumb", "Plumbing", "🔧", true),
        ServiceCategory("elect", "Electrical", "⚡", true),
        ServiceCategory("clean", "Cleaning", "✨"),
        ServiceCategory("hvac", "HVAC", "❄️", true),
        ServiceCategory("appliance", "Appliance", "🧊"),
        ServiceCategory("lock", "Locksmith", "🔑", true),
        ServiceCategory("paint", "Painting", "🎨"),
        ServiceCategory("carpentry", "Carpentry", "🔨"),
        ServiceCategory("roofing", "Roofing", "🏠", true),
        ServiceCategory("pest", "Pest Control", "🐜"),
        ServiceCategory("lawn", "Lawn Care", "🌿"),
        ServiceCategory("moving", "Moving", "📦"),
        ServiceCategory("solar", "Solar Energy", "☀️"),
        ServiceCategory("auto", "Mobile Auto", "🚗"),
        ServiceCategory("handyman", "Handyman", "🛠️"),
        ServiceCategory("pool", "Pool Care", "🏊"),
        ServiceCategory("smarthome", "Smart Home", "📱")
    )

    val featuredServices = listOf(
        ServiceItem(
            id = "svc_01",
            title = "Emergency Pipe Leak Repair & Snaking",
            categoryId = "plumb",
            basePrice = 129.0,
            durationMinutes = 60,
            rating = 4.95,
            reviewCount = 340,
            imageUrl = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600"
        ),
        ServiceItem(
            id = "svc_02",
            title = "Whole-House Deep Clean & Sanitization",
            categoryId = "clean",
            basePrice = 189.0,
            durationMinutes = 180,
            rating = 4.90,
            reviewCount = 512,
            imageUrl = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
        ),
        ServiceItem(
            id = "svc_03",
            title = "Home EV Charger 240V Installation",
            categoryId = "elect",
            basePrice = 349.0,
            durationMinutes = 120,
            rating = 4.98,
            reviewCount = 184,
            imageUrl = "https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=600"
        ),
        ServiceItem(
            id = "svc_04",
            title = "Central AC Leak & Refrigerant Recharge",
            categoryId = "hvac",
            basePrice = 165.0,
            durationMinutes = 90,
            rating = 4.88,
            reviewCount = 276,
            imageUrl = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600"
        ),
        ServiceItem(
            id = "svc_05",
            title = "Smart Deadbolt & High-Security Lock",
            categoryId = "lock",
            basePrice = 115.0,
            durationMinutes = 45,
            rating = 4.94,
            reviewCount = 389,
            imageUrl = "https://images.unsplash.com/photo-1558002038-1055907df827?w=600"
        ),
        ServiceItem(
            id = "svc_06",
            title = "Refrigerator Compressor & Ice Maker Fix",
            categoryId = "appliance",
            basePrice = 135.0,
            durationMinutes = 75,
            rating = 4.85,
            reviewCount = 210,
            imageUrl = "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600"
        ),
        ServiceItem(
            id = "svc_07",
            title = "Interior Room Painting & Wall Prep",
            categoryId = "paint",
            basePrice = 220.0,
            durationMinutes = 240,
            rating = 4.92,
            reviewCount = 165,
            imageUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600"
        ),
        ServiceItem(
            id = "svc_08",
            title = "Emergency Roofing Tarp & Leak Patch",
            categoryId = "roofing",
            basePrice = 280.0,
            durationMinutes = 90,
            rating = 4.96,
            reviewCount = 142,
            imageUrl = "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600"
        )
    )
}
