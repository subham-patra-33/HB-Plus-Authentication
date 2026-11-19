const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

export default {
  expo: {
    name: 'HB Plus Secure Auth',
    slug: 'hbplus-secure-auth',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'hbplusauth',
    newArchEnabled: true,
    web: {
      bundler: 'metro',
      // Single-page app: auth state is resolved on the client, no server rendering.
      output: 'single',
      favicon: './assets/favicon.png',
    },
    experiments: {
      typedRoutes: true,
    },
    plugins: [
      'expo-router',
      // Only needed for native iOS builds. Requires the reversed iOS client ID.
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
