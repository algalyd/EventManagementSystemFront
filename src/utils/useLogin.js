import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../settings/api";

const LOGIN_FAILED_MESSAGE = "Login failed, try again.";

const useLogin = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const loginUser = useCallback(async (user, setSubmitting) => {
        setSubmitting(true);
        try {
            const res = await api.post("/users/login", user);
            if (res.status === 200 || res.statusText.toLowerCase() === 'ok') {
                sessionStorage.setItem('logged_user', JSON.stringify(res.data));
                navigate("/");
            } else {
                setErrorMessage(LOGIN_FAILED_MESSAGE);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage(LOGIN_FAILED_MESSAGE);
            }
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    return { loginUser, errorMessage };
};

export default useLogin;
