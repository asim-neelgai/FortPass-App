import { ExpoConfig } from 'expo/config'

process.env = {
  ...process.env,
  // We build app using eas-cli using a build profile. These respective profile env variables are auto set by eas-cli from eas.json file.
  // However we run app using expo-cli that does not use these env variables that eas-cli would set. So we assume whenever these variables are missing the development profile variables are to be used.
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID ?? 'ba5141bf-2e37-46c0-95b7-e84b26530258',
  APP_SLUG: process.env.APP_SLUG ?? 'fort-lock-development',
  APP_BUNDLE_ID: process.env.APP_BUNDLE_ID ?? 'com.convergestack.fortlock.development',
  APP_VERSION: process.env.APP_VERSION ?? '0.0.1', // will be set by GitHub actions
  BUILD_NUMBER: process.env.BUILD_NUMBER ?? '1' // will be set by GitHub actions
}

const config: ExpoConfig = {
  name: 'Fort Lock',
  owner: 'convergestack',
  slug: process.env.APP_SLUG as string,
  version: process.env.APP_VERSION,
  orientation: 'portrait',
  icon: './assets/images/logo-icon.png',
  scheme: process.env.APP_BUNDLE_ID,
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.APP_BUNDLE_ID,
    buildNumber: process.env.BUILD_NUMBER,
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: process.env.APP_BUNDLE_ID,
    versionCode: parseInt(process.env.BUILD_NUMBER as string)
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    }
  }
}

export default config
