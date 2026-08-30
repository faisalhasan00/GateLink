package `in`.gatelink.guard

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

            notificationManager.deleteNotificationChannel("visitors")
            notificationManager.deleteNotificationChannel("guard_security_channel_v2")

            val soundUri = Uri.parse("${ContentResolver.SCHEME_ANDROID_RESOURCE}://${packageName}/raw/guard_alert")
            val ringtoneAudioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                .build()

            val alarmAudioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build()

            val guardSecurityChannel = NotificationChannel(
                "gatelink_guard_alarm_v3",
                "🛡️ Gate Clearance & Approvals",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Instant notification when resident approves or rejects a visitor at the gate"
                setSound(soundUri, ringtoneAudioAttributes)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 250, 500)
                setShowBadge(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }

            val guardEmergencyChannel = NotificationChannel(
                "gatelink_guard_emergency_v3",
                "🚨 Emergency SOS Sirens",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-priority emergency panic alarms from society residents"
                setSound(soundUri, alarmAudioAttributes)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 1000, 500, 1000)
                setShowBadge(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }

            notificationManager.createNotificationChannel(guardSecurityChannel)
            notificationManager.createNotificationChannel(guardEmergencyChannel)
        }
    }
}
