export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: Record<string, any>;
  android?: Record<string, any>;
  plugins?: Record<string, any>;
}
const config: CapacitorConfig = {
  appId: 'in.ac.davv.iet.rollcall',
  appName: 'RollCall',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    Geolocation: {
      // High accuracy GPS for geofence validation
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    },
  },
};

export default config;
