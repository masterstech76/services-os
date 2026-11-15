package com.serviceos.app.data.repository

import android.content.Context
import android.content.SharedPreferences
import com.serviceos.app.data.model.Booking
import com.serviceos.app.data.model.BookingStatus
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object BookingRepository {
    private const val PREFS_NAME = "serviceos_bookings_prefs"
    private const val KEY_BOOKINGS_JSON = "saved_bookings_v1"
    private const val KEY_SUPABASE_URL = "supabase_url"
    private const val KEY_SUPABASE_ANON_KEY = "supabase_anon_key"

    private var prefs: SharedPreferences? = null
    private val _bookings = MutableStateFlow<List<Booking>>(emptyList())
    val bookingsFlow: StateFlow<List<Booking>> = _bookings.asStateFlow()

    val sampleBookings: List<Booking>
        get() = _bookings.value

    fun init(context: Context) {
        if (prefs == null) {
            prefs = context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            loadFromPreferences()
        }
    }

    fun configureSupabase(url: String, anonKey: String) {
        prefs?.edit()
            ?.putString(KEY_SUPABASE_URL, url.trim())
            ?.putString(KEY_SUPABASE_ANON_KEY, anonKey.trim())
            ?.apply()
    }

    fun isCloudConfigured(): Boolean {
        val url = prefs?.getString(KEY_SUPABASE_URL, "") ?: ""
        val key = prefs?.getString(KEY_SUPABASE_ANON_KEY, "") ?: ""
        return url.startsWith("http") && !url.contains("your-project") && key.isNotEmpty()
    }

    private fun loadFromPreferences() {
        val raw = prefs?.getString(KEY_BOOKINGS_JSON, null) ?: return
        try {
            val arr = JSONArray(raw)
            val parsed = mutableListOf<Booking>()
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                parsed.add(
                    Booking(
                        id = obj.optString("id", ""),
                        reference = obj.optString("reference", "SO-10000"),
                        serviceTitle = obj.optString("serviceTitle", "Service Order"),
                        categoryName = obj.optString("categoryName", "Home Service"),
                        technicianName = obj.optString("technicianName", "Assigned Pro"),
                        technicianAvatar = obj.optString("technicianAvatar", ""),
                        technicianRating = obj.optDouble("technicianRating", 4.95),
                        customerAddress = obj.optString("customerAddress", ""),
                        scheduledTime = obj.optString("scheduledTime", "Today"),
                        baseAmount = obj.optDouble("baseAmount", 129.0),
                        extraPartsAmount = obj.optDouble("extraPartsAmount", 0.0),
                        taxAmount = obj.optDouble("taxAmount", 9.03),
                        totalAmount = obj.optDouble("totalAmount", 138.03),
                        status = runCatching {
                            BookingStatus.valueOf(obj.optString("status", "REQUESTED"))
                        }.getOrDefault(BookingStatus.REQUESTED),
                        safetyPin = obj.optString("safetyPin", "4892")
                    )
                )
            }
            _bookings.value = parsed
        } catch (_: Exception) {
            _bookings.value = emptyList()
        }
    }

    private fun saveToPreferences() {
        val current = _bookings.value
        val arr = JSONArray()
        for (b in current) {
            val obj = JSONObject()
            obj.put("id", b.id)
            obj.put("reference", b.reference)
            obj.put("serviceTitle", b.serviceTitle)
            obj.put("categoryName", b.categoryName)
            obj.put("technicianName", b.technicianName)
            obj.put("technicianAvatar", b.technicianAvatar)
            obj.put("technicianRating", b.technicianRating)
            obj.put("customerAddress", b.customerAddress)
            obj.put("scheduledTime", b.scheduledTime)
            obj.put("baseAmount", b.baseAmount)
            obj.put("extraPartsAmount", b.extraPartsAmount)
            obj.put("taxAmount", b.taxAmount)
            obj.put("totalAmount", b.totalAmount)
            obj.put("status", b.status.name)
            obj.put("safetyPin", b.safetyPin)
            arr.put(obj)
        }
        prefs?.edit()?.putString(KEY_BOOKINGS_JSON, arr.toString())?.apply()
    }

    fun addBooking(booking: Booking) {
        _bookings.value = listOf(booking) + _bookings.value
        saveToPreferences()
    }

    fun updateStatus(bookingId: String, newStatus: BookingStatus) {
        _bookings.value = _bookings.value.map {
            if (it.id == bookingId || it.reference == bookingId) it.copy(status = newStatus) else it
        }
        saveToPreferences()
    }

    suspend fun syncFromSupabase(): Boolean = withContext(Dispatchers.IO) {
        if (!isCloudConfigured()) return@withContext false
        val baseUrl = prefs?.getString(KEY_SUPABASE_URL, "")?.trimEnd('/') ?: return@withContext false
        val anonKey = prefs?.getString(KEY_SUPABASE_ANON_KEY, "") ?: return@withContext false

        try {
            val endpoint = URL("$baseUrl/rest/v1/bookings?select=*,services(name)&order=created_at.desc")
            val conn = (endpoint.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                setRequestProperty("apikey", anonKey)
                setRequestProperty("Authorization", "Bearer $anonKey")
                setRequestProperty("Accept", "application/json")
                connectTimeout = 8000
                readTimeout = 8000
            }
            if (conn.responseCode in 200..299) {
                val body = conn.inputStream.bufferedReader().use { it.readText() }
                val arr = JSONArray(body)
                val remoteList = mutableListOf<Booking>()
                for (i in 0 until arr.length()) {
                    val row = arr.getJSONObject(i)
                    val svc = row.optJSONObject("services")
                    val totalCents = row.optDouble("total_authorized_cents", 14900.0)
                    val laborCents = row.optDouble("labor_cost_cents", totalCents)
                    val partsCents = row.optDouble("parts_total_cents", 0.0)
                    val taxCents = row.optDouble("tax_amount_cents", 0.0)
                    val statusStr = row.optString("status", "REQUESTED")

                    remoteList.add(
                        Booking(
                            id = row.optString("id", ""),
                            reference = row.optString("booking_reference", "SO-10000"),
                            serviceTitle = svc?.optString("name", "Service Order") ?: "Service Order",
                            categoryName = "Home Service",
                            technicianName = "Assigned Pro",
                            technicianAvatar = "",
                            technicianRating = 4.95,
                            customerAddress = row.optString("address_text", ""),
                            scheduledTime = row.optString("scheduled_start", "Today"),
                            baseAmount = laborCents / 100.0,
                            extraPartsAmount = partsCents / 100.0,
                            taxAmount = taxCents / 100.0,
                            totalAmount = totalCents / 100.0,
                            status = runCatching { BookingStatus.valueOf(statusStr) }.getOrDefault(BookingStatus.REQUESTED),
                            safetyPin = row.optString("safety_pin", "4892")
                        )
                    )
                }
                _bookings.value = remoteList
                saveToPreferences()
                return@withContext true
            }
            false
        } catch (_: Exception) {
            false
        }
    }

    suspend fun releaseEscrowRemote(bookingId: String, pinCode: String): Boolean = withContext(Dispatchers.IO) {
        if (!isCloudConfigured()) return@withContext false
        val baseUrl = prefs?.getString(KEY_SUPABASE_URL, "")?.trimEnd('/') ?: return@withContext false
        val anonKey = prefs?.getString(KEY_SUPABASE_ANON_KEY, "") ?: return@withContext false

        try {
            val endpoint = URL("$baseUrl/rest/v1/rpc/release_escrow_to_technician")
            val conn = (endpoint.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("apikey", anonKey)
                setRequestProperty("Authorization", "Bearer $anonKey")
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 8000
                readTimeout = 8000
            }
            val payload = JSONObject().apply {
                put("p_booking_id", bookingId)
                put("p_pin_code", pinCode)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(payload.toString()) }
            val ok = conn.responseCode in 200..299
            if (ok) {
                updateStatus(bookingId, BookingStatus.COMPLETED)
            }
            ok
        } catch (_: Exception) {
            false
        }
    }
}
