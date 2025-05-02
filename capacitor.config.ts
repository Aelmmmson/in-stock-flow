
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.720f674ae43c4b119b5b8afc4b35bab6',
  appName: 'in-stock-flow',
  webDir: 'dist',
  server: {
    url: 'https://720f674a-e43c-4b11-9b5b-8afc4b35bab6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      spinnerColor: "#0EA5E9",
    },
  }
};

export default config;
