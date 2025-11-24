/**
 * @fileoverview Jest Configuration
 * @description Configuration for Jest testing framework
 * This extends create-react-app's default Jest configuration
 */

module.exports = {
  // Use react-scripts preset (includes babel, etc.)
  preset: 'react-scripts',

  // The root directory for tests and modules
  roots: ['<rootDir>/src'],

  // Setup files to run before tests
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js',
    '<rootDir>/src/jest.setup.js'
  ],

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Test environment
  testEnvironment: 'jsdom',

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true,
};
