package com.budgetbuddy_frontend;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class SMSReceiverModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public SMSReceiverModule(@NonNull ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "SMSReceiverModule"; // Matches `NativeModules.SMSReceiverModule` in JS
    }

    // Method to send SMS data to React Native
    public static void sendSMSData(String sender, String messageBody, long receivedAt) {
    if (reactContext == null || !reactContext.hasActiveCatalystInstance()) {
        Log.e("SMS_RECEIVED", "React context is not ready, skipping event.");
        return;
    }

    try {
        WritableMap smsData = Arguments.createMap();
        smsData.putString("address", sender);
        smsData.putString("body", messageBody);
        smsData.putLong("date", receivedAt);

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onNewSMS", smsData);
    } catch (Exception e) {
        Log.e("SMS_RECEIVED", "Exception while sending SMS to JS: ", e);
    }
}

}
