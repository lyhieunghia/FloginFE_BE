import { validateUsername, validatePassword } from '../utils/validation';

describe('Login Validation Tests', () => {
  test('Username rỗng', () => {
    expect(validateUsername('')).toBe('Tên đăng nhập không được để trống');
  });
  test('Username quá ngắn', () => {
    expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
  });
  test('Username quá dài', () => {
    expect(validateUsername('a'.repeat(51))).toBe('Tên đăng nhập không được vượt quá 50 ký tự');
  });
  test('Username ký tự đặc biệt', () => {
    expect(validateUsername('user@name')).toBe('Tên đăng nhập chứa ký tự không hợp lệ');
  });
  test('Username hợp lệ', () => {
    expect(validateUsername('user_123')).toBe('');
  });

  test('Password rỗng', () => {
    expect(validatePassword('')).toBe('Mật khẩu không được để trống');
  });
  test('Password quá ngắn', () => {
    expect(validatePassword('12345')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
  });
  test('Password quá dài', () => {
    expect(validatePassword('Abc123'.repeat(17))).toBe('Mật khẩu không được vượt quá 100 ký tự'); // 102 ký tự
  });
  test('Password không có chữ', () => {
    expect(validatePassword('123456')).toBe('Mật khẩu phải có cả chữ và số');
  });
  test('Password không có số', () => {
    expect(validatePassword('abcdef')).toBe('Mật khẩu phải có cả chữ và số');
  });
  test('Password hợp lệ', () => {
    expect(validatePassword('Abc123')).toBe('');
  });
});
