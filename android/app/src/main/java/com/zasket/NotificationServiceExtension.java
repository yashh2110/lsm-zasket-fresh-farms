package com.zasket;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import androidx.core.app.NotificationCompat; 
import com.onesignal.BuildConfig;
import com.onesignal.OSNotificationDisplayedResult;
import com.onesignal.OSNotificationPayload;
import com.onesignal.NotificationExtenderService;
import com.onesignal.OSNotificationReceivedResult;
import java.net.URL;
import android.util.Log;
import android.widget.RemoteViews;
import android.content.Context;
import android.content.Intent;
// import android.R;

//import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

public class NotificationServiceExtension extends NotificationExtenderService {
    @Override
    protected boolean onNotificationProcessing(final OSNotificationReceivedResult receivedResult) {

        Log.d("OneSignalExtension", "onNotificationProcessing invoked");

        // https://developer.android.com/training/notify-user/custom-notification
        // Get the layouts to use in the custom notification
        final RemoteViews notificationSmallLayoutView = new RemoteViews(getPackageName(), R.layout.notification_small);
        final RemoteViews notificationLargeLayoutView = new RemoteViews(getPackageName(), R.layout.notification_large);

        final JSONObject data = receivedResult.payload.additionalData;

        OverrideSettings overrideSettings = new OverrideSettings();
        overrideSettings.extender = new NotificationCompat.Extender() {
            @Override
            public NotificationCompat.Builder extend(NotificationCompat.Builder builder) {
                Log.d("OneSignalExtension", "Notification received with payload: " + receivedResult.payload);
                String notification_small_image_url;
                String notification_large_image_url;
                if (data != null){
                    notification_small_image_url = data.optString("notification_small_image_url", null);
                    notification_large_image_url = data.optString("notification_large_image_url", null);
                    if (notification_small_image_url != null && notification_large_image_url != null) {
                        Log.d("OneSignalExtension", "notification_small_image_url: " + notification_small_image_url);
                        Log.d("OneSignalExtension", "notification_large_image_url: " + notification_large_image_url);
                        notificationSmallLayoutView.setImageViewBitmap(R.id.image_view_notification_small, getBitmapFromURL(notification_small_image_url));
                        notificationLargeLayoutView.setImageViewBitmap(R.id.image_view_notification_large, getBitmapFromURL(notification_large_image_url));
                        builder.setCustomContentView(notificationSmallLayoutView);
                        builder.setCustomBigContentView(notificationLargeLayoutView);
                        //.setStyle(new NotificationCompat.DecoratedCustomViewStyle())//recommended for full background and app title
                                
                    }
                }
                return builder;
            }
        };
        OSNotificationDisplayedResult displayedResult = displayNotification(overrideSettings);
        Log.d("OneSignalExtension", "Notification displayed with id: " + displayedResult.androidNotificationId);
        // Return true to stop the notification from displaying.
        return false;
    }

    private static Bitmap getBitmapFromURL(String location) {
        try {
            return BitmapFactory.decodeStream(new URL(location).openConnection().getInputStream());
        } catch (Throwable t) {
            Log.i("OneSignalExample", "COULD NOT DOWNLOAD IMAGE");
        }
        return null;
    }
}