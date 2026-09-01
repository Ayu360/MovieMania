const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

const TARGET_META = 'com.google.firebase.messaging.default_notification_color';

module.exports = function withFirebaseNotificationColorFix(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    const metaData = (app['meta-data'] ??= []);

    const entry = metaData.find(
      (m) => m.$?.['android:name'] === TARGET_META,
    );

    if (entry) {
      entry.$['tools:replace'] = 'android:resource';
    }

    return cfg;
  });
};
