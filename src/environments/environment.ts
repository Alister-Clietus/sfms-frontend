import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  envName: 'development',
  apiUrl: 'http://localhost:8080/api/v1',
  appName: 'SFMS (Local Dev)',
  oauth: {
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/oauth/callback'
  }
};