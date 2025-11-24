const validateUsername = (username = "") => {
    if (username.trim() === "") return "Username không được để trống";
    if (username.length < 3) return "Username phải có ít nhất 3 ký tự";
    if (username.length > 16) return "Username không được vượt quá 16 ký tự";
    if (/\s/.test(username)) return "Username không được chứa khoảng trắng";
    return '';
};

const validatePassword = (password = "") => {
    if (password.trim() === "") return "Password không được để trống";
    if (password.length < 6) return "Password phải có ít nhất 6 ký tự";
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
