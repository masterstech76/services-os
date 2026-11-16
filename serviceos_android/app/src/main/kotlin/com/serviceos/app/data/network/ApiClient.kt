package com.serviceos.app.data.network

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object ApiClient {
    private const val PREFS_NAME = "serviceos_secure_prefs"
    private const val KEY_ACCESS_TOKEN = "access_token"
    private const val KEY_REFRESH_TOKEN = "refresh_token"
    private const val KEY_TENANT_ID = "tenant_id"
    private const val DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000001"
    private const val DEFAULT_BASE_URL = "http://10.0.2.2:3000/api/v1"

    private var prefs: SharedPreferences? = null
    private var baseUrl: String = DEFAULT_BASE_URL

    @Synchronized
    fun init(context: Context, customBaseUrl: String? = null) {
        if (prefs == null) {
            prefs = try {
                val masterKey = MasterKey.Builder(context.applicationContext)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build()
                EncryptedSharedPreferences.create(
                    context.applicationContext,
                    PREFS_NAME,
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                )
            } catch (e: Exception) {
                context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            }
        }
        if (!customBaseUrl.isNullOrBlank()) {
            baseUrl = customBaseUrl.trimEnd('/')
        }
    }

    fun setTokens(accessToken: String, refreshToken: String) {
        prefs?.edit()
            ?.putString(KEY_ACCESS_TOKEN, accessToken)
            ?.putString(KEY_REFRESH_TOKEN, refreshToken)
            ?.apply()
    }

    fun getAccessToken(): String? = prefs?.getString(KEY_ACCESS_TOKEN, null)

    fun clearTokens() {
        prefs?.edit()
            ?.remove(KEY_ACCESS_TOKEN)
            ?.remove(KEY_REFRESH_TOKEN)
            ?.apply()
    }

    fun getTenantId(): String = prefs?.getString(KEY_TENANT_ID, DEFAULT_TENANT_ID) ?: DEFAULT_TENANT_ID

    private suspend fun executeRequest(
        endpoint: String,
        method: String = "GET",
        bodyJson: JSONObject? = null
    ): Result<JSONObject> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl$endpoint")
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = method
                connectTimeout = 15000
                readTimeout = 15000
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Accept", "application/json")
                setRequestProperty("x-tenant-id", getTenantId())

                val token = getAccessToken()
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }

                if (bodyJson != null && (method == "POST" || method == "PUT" || method == "PATCH")) {
                    doOutput = true
                    OutputStreamWriter(outputStream, "UTF-8").use { it.write(bodyJson.toString()) }
                }
            }

            val statusCode = connection.responseCode
            val stream = if (statusCode in 200..299) connection.inputStream else connection.errorStream
            val responseString = BufferedReader(InputStreamReader(stream, "UTF-8")).use { it.readText() }

            val json = JSONObject(responseString)
            if (statusCode in 200..299 && json.optBoolean("success", true)) {
                Result.success(json)
            } else {
                val errorMsg = json.optJSONObject("error")?.optString("message") 
                    ?: "Request failed with code $statusCode"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // =========================================================================
    // API OPERATIONS
    // =========================================================================
    suspend fun login(email: String, password: String): Result<JSONObject> {
        val body = JSONObject().apply {
            put("email", email)
            put("password", password)
        }
        val result = executeRequest("/auth/login", "POST", body)
        result.onSuccess { res ->
            val tokens = res.optJSONObject("data")?.optJSONObject("tokens")
            if (tokens != null) {
                setTokens(tokens.getString("accessToken"), tokens.getString("refreshToken"))
            }
        }
        return result
    }

    suspend fun fetchCategories(): Result<JSONArray> {
        val result = executeRequest("/services/categories", "GET")
        return result.map { it.optJSONArray("data") ?: JSONArray() }
    }

    suspend fun fetchServices(categoryId: String? = null): Result<JSONArray> {
        val endpoint = if (categoryId != null) "/services?categoryId=$categoryId" else "/services"
        val result = executeRequest(endpoint, "GET")
        return result.map { it.optJSONArray("data") ?: JSONArray() }
    }

    suspend fun fetchBookings(status: String? = null): Result<JSONArray> {
        val endpoint = if (status != null) "/bookings?status=$status" else "/bookings"
        val result = executeRequest(endpoint, "GET")
        return result.map { it.optJSONArray("data") ?: JSONArray() }
    }

    suspend fun createBooking(bookingJson: JSONObject): Result<JSONObject> {
        val result = executeRequest("/bookings", "POST", bookingJson)
        return result.map { it.optJSONObject("data") ?: JSONObject() }
    }

    suspend fun verifyArrivalPin(bookingId: String, pin: String): Result<JSONObject> {
        val body = JSONObject().apply { put("safetyPin", pin) }
        val result = executeRequest("/bookings/$bookingId/verify-arrival", "POST", body)
        return result.map { it.optJSONObject("data") ?: JSONObject() }
    }

    suspend fun sendLocationPing(lat: Double, lng: Double, heading: Double? = null, dutyStatus: String? = null): Result<Boolean> {
        val body = JSONObject().apply {
            put("latitude", lat)
            put("longitude", lng)
            if (heading != null) put("headingDegrees", heading)
            if (dutyStatus != null) put("dutyStatus", dutyStatus)
        }
        val result = executeRequest("/crm/technicians/location-ping", "POST", body)
        return result.map { true }
    }
}
