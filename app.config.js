const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

export default {
  expo: {
    name: 'HB Plus',
    slug: 'hbplus-auth',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'hbplus',
    newArchEnabled: true,

    extra: {
      eas: {
        projectId: '2207ab41-16ab-4c66-87dc-1b17c97816ae',
      },
    },

    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
    },
    experiments: {
      typedRoutes: true,
    },
    plugins: [
      'expo-router',
      ...(iosUrlScheme
        ? [
            [
              '@react-native-google-signin/google-signin',
              { iosUrlScheme },
            ],
          ]
        : []),
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'fit.hbplus.secureauth',
    },
    android: {
      package: 'fit.hbplus.secureauth',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
  },
};
