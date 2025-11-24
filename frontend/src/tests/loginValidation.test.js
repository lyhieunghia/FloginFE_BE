import { 
    validateLoginForm
} from "../utils/loginValidation";

// Test Login Validation
describe("Login Validation Tests", () => {

    test("TC1: Dữ liệu hợp lệ không trả về lỗi", () => {
        const username = "validUser";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.isValid).toBe(true);
    });

    test("TC2: Username rỗng trả về lỗi", () => {
        const username = "";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.usernameError).toBe("Username không được để trống");
    });

    test("TC3: Username quá ngắn trả về lỗi", () => {
        const username = "ab";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.usernameError).toBe("Username phải có ít nhất 3 ký tự");
    });

    test("TC4: Username quá dài trả về lỗi", () => {
        const username = "thisisaverylongusername";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.usernameError).toBe("Username không được vượt quá 16 ký tự");
    });

    test("TC5: Username chứa khoảng trắng trả về lỗi", () => {
        const username = "invalid user";
        const password = "ValidPass123";
        const errors = validateLoginForm(username, password);
        expect(errors.usernameError).toBe("Username không được chứa khoảng trắng");
    });

    test("TC6: Password rỗng trả về lỗi", () => {
        const username = "validUser";
        const password = "";
        const errors = validateLoginForm(username, password);
        expect(errors.passwordError).toBe("Password không được để trống");
    });

    test("TC7: Password quá ngắn trả về lỗi", () => {
        const username = "validUser";
        const password = "123";
        const errors = validateLoginForm(username, password);
        expect(errors.passwordError).toBe("Password phải có ít nhất 6 ký tự");
    });
});
