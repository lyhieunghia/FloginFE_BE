// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Thêm 2 dòng này để sửa lỗi CORS của JSDOM
import axios from 'axios';
axios.defaults.adapter = 'http';

// Khắc phục lỗi JSDOM không hỗ trợ window.scrollTo
window.scrollTo = jest.fn();