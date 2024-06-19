

const validateEmail = (email) => {
    if (!email) {
        return "Email is required!";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        return "Invalid email address!";
    }
    return null;
};

const validateUsername = (username) => {
    if (!username || username.length < 5) {
        return "Username is required and must be at least 5 characters long!";
    }
    return null;
};

const validatePassword = (password) => {
    if (!password) {
        return "Password is required!";
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(password)) {
        return "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character!";
    }
    return null;
};

export default function validateSignupForm(values) {
    const errors = {};

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const usernameError = validateUsername(values.username);
    if (usernameError) errors.username = usernameError;

    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;

    return errors;
}
