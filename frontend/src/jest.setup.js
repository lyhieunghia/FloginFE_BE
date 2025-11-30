/**
 * @fileoverview Jest Setup File
 * @description Global setup and configuration for all Jest tests
 * Runs after setupTests.js
 */

import '@testing-library/jest-dom';

// Mock console methods to reduce noise in test output
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

// Clean up after all tests
afterAll(() => {
  jest.clearAllMocks();
  jest.resetModules();
  jest.restoreAllMocks();
});

// Global test utilities
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));

