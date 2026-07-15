export interface Environment {
  production: boolean;
  envName: 'development' | 'staging' | 'production';
  apiUrl: string;
  appName: string;
  oauth: {
    googleClientId: string;
    redirectUri: string;
  };
}