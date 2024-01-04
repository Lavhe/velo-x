package com.velox

import android.location.Location
import com.facebook.react.bridge.*
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import java.util.*

class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val fusedLocationClient: FusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(reactContext)
    private var location: Location? = null

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun getCurrentLocation(callback: Callback) {
        val taskLocation = fusedLocationClient.getCurrentLocation(100, null)

        taskLocation.addOnSuccessListener { loc ->
            if (loc != null) {
                location = loc
            }

            val mapResponse: WritableMap = Arguments.createMap()

            if (location != null) {
                val accuracy: Float = location!!.accuracy
                val speedAccuracy: Float = location!!.speedAccuracyMetersPerSecond

                if (accuracy < 40) {
                    mapResponse.putDouble("latitude", location!!.latitude)
                    mapResponse.putDouble("longitude", location!!.longitude)
                    mapResponse.putDouble("speed", location!!.speed.toDouble())
                    mapResponse.putDouble("timestamp", location!!.time.toDouble())
                    mapResponse.putDouble("speedAccuracy", speedAccuracy.toDouble())
                    mapResponse.putDouble("accuracy", accuracy.toDouble())
                    mapResponse.putBoolean("isNew", true)
                } else {
                    mapResponse.putBoolean("isNew", false)
                }
            }

            if (loc == null) {
                mapResponse.putBoolean("isNew", false)
            }
            callback.invoke(mapResponse)
        }
    }
}
