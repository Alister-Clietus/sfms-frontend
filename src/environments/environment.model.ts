export interface Environment {
  production: boolean;
  envName: 'development' | 'staging' | 'production';
  apiUrl: string;
  appName: string;
}