package com.jmrsquared.velox;

import java.util.Timer;
import java.util.TimerTask;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import android.location.Location;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;
import java.util.HashMap;

public class LocationModule extends ReactContextBaseJavaModule {
    private FusedLocationProviderClient fusedLocationClient;
    private Location location;

    LocationModule(ReactApplicationContext context) {
       super(context);
       
       this.fusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
   }
   
    @Override
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void getCurrentLocation(Callback callback) {
        Task<Location> taskLocation = fusedLocationClient.getCurrentLocation(100, null);

        taskLocation.addOnSuccessListener(loc -> {
                if(loc != null){
                    location = loc;
                }

                WritableMap mapResponse = Arguments.createMap();

                if(location != null){
                    float accuracy = location.getAccuracy();
                    float speedAccuracy = location.getSpeedAccuracyMetersPerSecond();

                    if(accuracy < 40){
                        mapResponse.putDouble("latitude", location.getLatitude());
                        mapResponse.putDouble("longitude", location.getLongitude());
                        mapResponse.putDouble("speed", location.getSpeed());
                        mapResponse.putDouble("timestamp", location.getTime());
                        mapResponse.putDouble("speedAccuracy", speedAccuracy);
                        mapResponse.putDouble("accuracy", accuracy);
                        mapResponse.putBoolean("isNew", true);
                    } else{ 
                        mapResponse.putBoolean("isNew", false);
                    }
                }
                
                if(loc == null) {
                    mapResponse.putBoolean("isNew", false);
                }
                callback.invoke(mapResponse);
        });
    }
}