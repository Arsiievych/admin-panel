export const environment = {
  production: true,
  api: {
    baseUrl: 'http://api.example.com/api/admin',
    healthcheckUrl: 'http://api.example.com/healthcheck',
  },
} as const;
