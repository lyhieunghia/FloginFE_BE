/**
 * Validates username according to business rules
 * Rules:
 * - Length: 3-20 characters
 * - Allowed: letters, numbers, underscore, hyphen
 * - Must start with letter or number
 */
const validateUsername = (username = "") => {
    if (username.trim() === "") return "Username không được để trống";
    if (username.length < 3) return "Username phải có ít nhất 3 ký tự";
    if (username.length > 16) return "Username không được vượt quá 16 ký tự";
    if (/\s/.test(username)) return "Username không được chứa khoảng trắng";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username không được chứa kí tự đặc biệt";
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
    if (password.trim() === "") return "Password không được để trống";
    if (password.length < 6) return "Password phải có ít nhất 6 ký tự";
    if (!/[a-zA-Z]/.test(password)) return "Password phải chứa ít nhất 1 chữ cái";
    if (!/[0-9]/.test(password)) return "Password phải chứa ít nhất 1 chữ số";
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
