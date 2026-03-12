import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.galaxy.spacecrafts',
  appName: 'Galaxy SpaceCrafts',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Para desenvolvimento local, descomente a linha abaixo e substitua pelo IP do seu computador
    // url: 'http://192.168.1.100:3000',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    Camera: {
      requestPermissions: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    permissions: [
      'CAMERA',
      'USB_DEVICE',
      'USB_ACCESSORY',
      'MODIFY_AUDIO_SETTINGS',
      'RECORD_AUDIO',
      'WRITE_EXTERNAL_STORAGE',
      'READ_EXTERNAL_STORAGE'
    ],
  },
};

export default config;
