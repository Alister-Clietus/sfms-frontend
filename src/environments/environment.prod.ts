import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  envName: 'production',
  apiUrl: 'https://api.sfms-system.internal/api/v1',
  appName: 'Scholarship and Financial Management System',
  oauth: {
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'https://sfms-system.internal/oauth/callback'
  }
};