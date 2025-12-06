// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.scrollTo for jsdom compatibility
window.scrollTo = jest.fn();

// Note: axios mocking is handled by src/__mocks__/axios.js
// Jest will automatically use that mock when jest.mock('axios') is called in test files