import { 
    validateLoginForm
} from "../utils/loginValidation";

/**
 * Login Validation Tests
 * Coverage target: >= 90%
 * 
 * Tests include:
 * - validateUsername(): 4 test cases (2 điểm)
 * - validatePassword(): 4 test cases (2 điểm)
 */
describe("Login Validation Tests", () => {

    // ============================================================
    // Test validateUsername() - 2 điểm
    // ============================================================

    describe("validateUsername()", () => {
        
        // TC1: Test username rỗng
        test("TC1.1: Username null/undefined trả về lỗi", () => {
            expect(validateLoginForm(null, "Pass123").usernameError).toBe("Username không được để trống");
            expect(validateLoginForm(undefined, "Pass123").usernameError).toBe("Username không được để trống");
        });

        test("TC1.2: Username rỗng trả về lỗi", () => {
            const errors = validateLoginForm("", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username không được để trống");
        });

        test("TC1.3: Username chỉ có khoảng trắng trả về lỗi", () => {
            const errors = validateLoginForm("   ", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username không được để trống");
        });

        // TC2: Test username quá ngắn/dài
        test("TC2.1: Username quá ngắn (2 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("ab", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username phải có ít nhất 3 ký tự");
        });

        test("TC2.2: Username quá ngắn (1 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("a", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username phải có ít nhất 3 ký tự");
        });

        test("TC2.3: Username quá dài (21 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("abcdefghij1234567890x", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username không được vượt quá 20 ký tự");
        });

        test("TC2.4: Username quá dài (30 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("a".repeat(30), "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username không được vượt quá 20 ký tự");
        });

        // TC3: Test ký tự đặc biệt không hợp lệ
        test("TC3.1: Username bắt đầu bằng underscore trả về lỗi", () => {
            const errors = validateLoginForm("_user123", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username phải bắt đầu bằng chữ cái hoặc số");
        });

        test("TC3.2: Username bắt đầu bằng hyphen trả về lỗi", () => {
            const errors = validateLoginForm("-user123", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username phải bắt đầu bằng chữ cái hoặc số");
        });

        test("TC3.3: Username chứa ký tự đặc biệt @ trả về lỗi", () => {
            const errors = validateLoginForm("user@123", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username chỉ được chứa chữ cái, số, dấu gạch dưới và gạch ngang");
        });

        test("TC3.4: Username chứa khoảng trắng trả về lỗi", () => {
            const errors = validateLoginForm("user name", "ValidPass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe("Username chỉ được chứa chữ cái, số, dấu gạch dưới và gạch ngang");
        });

        test("TC3.5: Username chứa ký tự đặc biệt ! # $ trả về lỗi", () => {
            expect(validateLoginForm("user!", "Pass123").usernameError).toBeTruthy();
            expect(validateLoginForm("user#name", "Pass123").usernameError).toBeTruthy();
            expect(validateLoginForm("user$", "Pass123").usernameError).toBeTruthy();
        });

        // TC4: Test username hợp lệ
        test("TC4.1: Username hợp lệ - chữ và số", () => {
            const errors = validateLoginForm("user123", "ValidPass123");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
        });

        test("TC4.2: Username hợp lệ - có underscore", () => {
            const errors = validateLoginForm("user_123", "ValidPass123");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
        });

        test("TC4.3: Username hợp lệ - có hyphen", () => {
            const errors = validateLoginForm("user-name", "ValidPass123");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
        });

        test("TC4.4: Username hợp lệ - minimum length (3 chars)", () => {
            const errors = validateLoginForm("abc", "ValidPass123");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
        });

        test("TC4.5: Username hợp lệ - maximum length (20 chars)", () => {
            const errors = validateLoginForm("abcdefghij1234567890", "ValidPass123");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
        });

        test("TC4.6: Username hợp lệ - mixed case", () => {
            const errors = validateLoginForm("JohnDoe123", "ValidPass123");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
        });
    });

    // ============================================================
    // Test validatePassword() - 2 điểm
    // ============================================================

    describe("validatePassword()", () => {
        
        // TC1: Test password rỗng
        test("TC1.1: Password null/undefined trả về lỗi", () => {
            expect(validateLoginForm("validUser", null).passwordError).toBe("Password không được để trống");
            expect(validateLoginForm("validUser", undefined).passwordError).toBe("Password không được để trống");
        });

        test("TC1.2: Password rỗng trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password không được để trống");
        });

        // TC2: Test password quá ngắn/dài
        test("TC2.1: Password quá ngắn (5 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "abc12");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải có ít nhất 6 ký tự");
        });

        test("TC2.2: Password quá ngắn (1 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "a");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải có ít nhất 6 ký tự");
        });

        test("TC2.3: Password quá dài (31 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "abcdefghij1234567890abcdefghijk");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password không được vượt quá 30 ký tự");
        });

        test("TC2.4: Password quá dài (50 ký tự) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "a".repeat(50));
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password không được vượt quá 30 ký tự");
        });

        // TC3: Test password không có chữ hoặc số
        test("TC3.1: Password chỉ có số (không có chữ) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "123456");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải chứa ít nhất một chữ cái");
        });

        test("TC3.2: Password chỉ có chữ thường (không có số) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "abcdef");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải chứa ít nhất một chữ số");
        });

        test("TC3.3: Password chỉ có chữ hoa (không có số) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "ABCDEF");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải chứa ít nhất một chữ số");
        });

        test("TC3.4: Password chỉ có chữ mixed case (không có số) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "AbCdEf");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải chứa ít nhất một chữ số");
        });

        test("TC3.5: Password chỉ có ký tự đặc biệt (không có chữ và số) trả về lỗi", () => {
            const errors = validateLoginForm("validUser", "!@#$%^");
            expect(errors.isValid).toBe(false);
            expect(errors.passwordError).toBe("Password phải chứa ít nhất một chữ cái");
        });

        // TC4: Test password hợp lệ
        test("TC4.1: Password hợp lệ - chữ thường và số", () => {
            const errors = validateLoginForm("validUser", "abc123");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });

        test("TC4.2: Password hợp lệ - chữ hoa và số", () => {
            const errors = validateLoginForm("validUser", "ABC123");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });

        test("TC4.3: Password hợp lệ - mixed case và số", () => {
            const errors = validateLoginForm("validUser", "Pass123");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });

        test("TC4.4: Password hợp lệ - có ký tự đặc biệt", () => {
            const errors = validateLoginForm("validUser", "Pass@123");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });

        test("TC4.5: Password hợp lệ - minimum length (6 chars)", () => {
            const errors = validateLoginForm("validUser", "abc123");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });

        test("TC4.6: Password hợp lệ - maximum length (30 chars)", () => {
            const errors = validateLoginForm("validUser", "abcdefghij1234567890abcdefgh12");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });

        test("TC4.7: Password hợp lệ - complex password", () => {
            const errors = validateLoginForm("validUser", "MyV3ryStr0ng!P@ss");
            expect(errors.isValid).toBe(true);
            expect(errors.passwordError).toBe('');
        });
    });

    // ============================================================
    // Integration Tests
    // ============================================================

    describe("validateLoginForm() - Integration", () => {
        
        test("Both username and password valid", () => {
            const errors = validateLoginForm("john_doe", "Pass123!");
            expect(errors.isValid).toBe(true);
            expect(errors.usernameError).toBe('');
            expect(errors.passwordError).toBe('');
        });

        test("Both username and password invalid", () => {
            const errors = validateLoginForm("ab", "123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBeTruthy();
            expect(errors.passwordError).toBeTruthy();
        });

        test("Username valid, password invalid", () => {
            const errors = validateLoginForm("validUser", "abc");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBe('');
            expect(errors.passwordError).toBeTruthy();
        });

        test("Username invalid, password valid", () => {
            const errors = validateLoginForm("ab", "Pass123");
            expect(errors.isValid).toBe(false);
            expect(errors.usernameError).toBeTruthy();
            expect(errors.passwordError).toBe('');
        });
    });
});
