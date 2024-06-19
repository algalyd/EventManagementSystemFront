import api from "../settings/api";

const handleUserRegistration = async (userData, finalizeSubmission, setErrorMessage, navigate) => {
    try {
        console.log("Sending user data to API:", userData);
        const registrationResponse = await api.post("/users", userData);
        console.log("Received response from API:", registrationResponse);
        const { status } = registrationResponse;

        if (status === 200 || status === 201) {
            console.log("Registration successful, storing user data in session storage.");
            navigate("/login");  // Navigate to homepage
        } else {
            console.error("Registration failed with status:", status);
            setErrorMessage(`Registration failed with status: ${status}`);
        }
    } catch (error) {
        console.error("An error occurred during registration:", error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "An error occurred when signing up. Try again!";
        setErrorMessage(errorMessage);  // Set error message for the UI
    } finally {
        finalizeSubmission(false);
    }
};

export default handleUserRegistration;
