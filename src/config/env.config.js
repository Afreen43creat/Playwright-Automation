require('dotenv').config();

const environments = {
  dev: {
    baseURL: process.env.DEV_BASE_URL || 'https://www.saucedemo.com',
    apiBaseURL: process.env.API_BASE_URL || 'https://api.example-ecommerce.test'
  },
  staging: {
    baseURL: process.env.STAGING_BASE_URL || 'https://www.saucedemo.com',
    apiBaseURL: process.env.API_BASE_URL || 'https://api.example-ecommerce.test'
  },
  production: {
    baseURL: process.env.PROD_BASE_URL || 'https://www.saucedemo.com',
    apiBaseURL: process.env.API_BASE_URL || 'https://api.example-ecommerce.test'
  }
};

function getEnvConfig() {
  const selectedEnv = process.env.TEST_ENV || 'dev';
  const config = environments[selectedEnv];

  if (!config) {
    throw new Error(`Unsupported TEST_ENV "${selectedEnv}". Use dev, staging, or production.`);
  }

  return {
    name: selectedEnv,
    ...config
  };
}

module.exports = { getEnvConfig };
