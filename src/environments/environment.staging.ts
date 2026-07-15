import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  envName: 'staging',
  apiUrl: 'https://staging-api.sfms-system.internal/api/v1',
  appName: 'SFMS (Staging)',
  oauth: {
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'https://staging.sfms-system.internal/oauth/callback'
  }
};