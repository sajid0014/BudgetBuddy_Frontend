package com.budgetbuddy_frontend;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class SMSReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    for (Object pdu : pdus) {
                        SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdu);
                        String sender = sms.getOriginatingAddress();
                        String messageBody = sms.getMessageBody();

                        // Extract the timestamp
                        long timestampMillis = sms.getTimestampMillis();
                        String formattedDate = formatDate(timestampMillis);

                        Log.d("SMS_RECEIVED", "From: " + sender + 
                            ", Message: " + messageBody + 
                            ", Received at: " + formattedDate);

                        // Send SMS data to React Native via the module
                        SMSReceiverModule.sendSMSData(sender, messageBody, timestampMillis);
                    }
                }
            }
        }
    }

    // Helper method to format timestamp into readable date & time
    private String formatDate(long timestampMillis) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm a", Locale.getDefault());
        return dateFormat.format(new Date(timestampMillis));
    }
}
