package `in`.gatelink.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ContentResolver
import android.content.Context
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.Bundle
import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Clean up legacy channels that might have registered with default sound
            notificationManager.deleteNotificationChannel("gate_security_channel")
            notificationManager.deleteNotificationChannel("gate_security_channel_v2")

            val soundUri = Uri.parse("${ContentResolver.SCHEME_ANDROID_RESOURCE}://${packageName}/raw/resident_bell")
            val ringtoneAudioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                .build()

            val alarmAudioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build()

            // 1. Gate & Visitor Doorbell (Primary visitor alert)
            val gateChannel = NotificationChannel(
                "gatelink_resident_doorbell_v3",
                "🚪 Gate & Visitor Doorbell",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Immediate visitor arrival alerts with custom GateLink doorbell chime"
                setSound(soundUri, ringtoneAudioAttributes)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 400, 200, 400)
                setShowBadge(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }

            // 2. Emergency SOS Channel
            val emergencyChannel = NotificationChannel(
                "gatelink_resident_emergency_v3",
                "🚨 Emergency SOS Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-priority life safety and emergency panic alerts"
                setSound(soundUri, alarmAudioAttributes)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 800, 400, 800)
                setShowBadge(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }

            // 3. Society Updates Channel
            val updatesChannel = NotificationChannel(
                "gatelink_resident_updates_v3",
                "📢 Society Notices & Bills",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Announcements, maintenance invoices, and society notices"
                setSound(soundUri, ringtoneAudioAttributes)
                enableVibration(true)
                setShowBadge(true)
            }

            notificationManager.createNotificationChannel(gateChannel)
            notificationManager.createNotificationChannel(emergencyChannel)
            notificationManager.createNotificationChannel(updatesChannel)
        }
    }
}
