/**
 * Validates username according to business rules
 * Rules:
 * - Length: 3-20 characters
 * - Allowed: letters, numbers, underscore, hyphen
 * - Must start with letter or number
 */
const validateUsername = (username = "") => {
    // TC1: Test username rỗng
    if (!username || username.trim() === "") {
        return "Username không được để trống";
    }

    // TC2: Test username quá ngắn/dài
    if (username.length < 3) {
        return "Username phải có ít nhất 3 ký tự";
    }
    if (username.length > 20) {
        return "Username không được vượt quá 20 ký tự";
    }

    // TC3: Test ký tự đặc biệt không hợp lệ
    // Must start with letter or number
    if (!/^[a-zA-Z0-9]/.test(username)) {
        return "Username phải bắt đầu bằng chữ cái hoặc số";
    }
    
    // Can only contain letters, numbers, underscore, and hyphen
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(username)) {
        return "Username chỉ được chứa chữ cái, số, dấu gạch dưới và gạch ngang";
    }

    // TC4: Username hợp lệ
    return '';
};

/**
 * Validates password according to business rules
 * Rules:
 * - Length: 6-30 characters
 * - Must contain at least one letter (a-z or A-Z)
 * - Must contain at least one digit (0-9)
 */
const validatePassword = (password = "") => {
    // TC1: Test password rỗng
    if (!password || password === "") {
        return "Password không được để trống";
    }

    // TC2: Test password quá ngắn/dài
    if (password.length < 6) {
        return "Password phải có ít nhất 6 ký tự";
    }
    if (password.length > 30) {
        return "Password không được vượt quá 30 ký tự";
    }

    // TC3: Test password không có chữ hoặc số
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);

    if (!hasLetter) {
        return "Password phải chứa ít nhất một chữ cái";
    }
    if (!hasDigit) {
        return "Password phải chứa ít nhất một chữ số";
    }

    // TC4: Password hợp lệ
    return '';
};

export const validateLoginForm = (username = "", password = "") => {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    return {
        isValid: !usernameError && !passwordError,
        usernameError,
        passwordError,
    };
};
