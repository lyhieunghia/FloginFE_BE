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

    test("TC5: Username chứa khoảng trắng trả về lỗi", () => {
        const username = "invalid user";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.usernameError).toBe("Username không được chứa khoảng trắng");
    });

    test("TC6: Username chứa kí tự đặc biệt trả về lỗi", () => {
        const username = "invalid#$%^<>";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.usernameError).toBe("Username không được chứa kí tự đặc biệt");
    });

    test("TC7: Password rỗng trả về lỗi", () => {
        const username = "validUser";
        const password = "";
        const errors = validateLoginForm(username, password);
        expect(errors.passwordError).toBe("Password không được để trống");
    });

    test("TC8: Password quá ngắn trả về lỗi", () => {
        const username = "validUser";
        const password = "123";
        const errors = validateLoginForm(username, password);
        expect(errors.passwordError).toBe("Password phải có ít nhất 6 ký tự");
    });

    test("TC9: Password không có chữ cái trả về lỗi", () => {
        const username = "validUser";
        const password = "123123";
        const errors = validateLoginForm(username, password);
        expect(errors.passwordError).toBe("Password phải chứa ít nhất 1 chữ cái");
    });

    test("TC10: Password quá ngắn trả về lỗi", () => {
        const username = "validUser";
        const password = "abcdefgh";
        const errors = validateLoginForm(username, password);
        expect(errors.passwordError).toBe("Password phải chứa ít nhất 1 chữ số");
    });
})});
