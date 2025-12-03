/**
 * Validates username according to business rules
 * Rules:
 * - Length: 3-20 characters
 * - Allowed: letters, numbers, underscore, hyphen
 * - Must start with letter or number
 */
const validateUsername = (username) => {
    // Handle null and undefined explicitly
    if (username === null || username === undefined) {
        return "Username không được để trống";
    }
    // Convert to string to handle edge cases
    const usernameStr = String(username);
    if (usernameStr.trim() === "") return "Username không được để trống";
    if (usernameStr.length < 3) return "Username phải có ít nhất 3 ký tự";
    if (usernameStr.length > 16) return "Username không được vượt quá 16 ký tự";
    if (/\s/.test(usernameStr)) return "Username không được chứa khoảng trắng";
    if (!/^[a-zA-Z0-9_]+$/.test(usernameStr)) return "Username không được chứa kí tự đặc biệt";
    return '';
};

/**
 * Validates password according to business rules
 * Rules:
 * - Length: 6-30 characters
 * - Must contain at least one letter (a-z or A-Z)
 * - Must contain at least one digit (0-9)
 */
const validatePassword = (password) => {
    // Handle null and undefined explicitly
    if (password === null || password === undefined) {
        return "Password không được để trống";
    }
    // Convert to string to handle edge cases
    const passwordStr = String(password);
    if (passwordStr.trim() === "") return "Password không được để trống";
    if (passwordStr.length < 6) return "Password phải có ít nhất 6 ký tự";
    if (!/[a-zA-Z]/.test(passwordStr)) return "Password phải chứa ít nhất 1 chữ cái";
    if (!/[0-9]/.test(passwordStr)) return "Password phải chứa ít nhất 1 chữ số";
    return '';
};

export const validateLoginForm = (username, password) => {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    return {
        isValid: !usernameError && !passwordError,
        usernameError,
        passwordError,
    };
};
