import { useState } from "react";
import { MdEvent } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import handleUserRegistration from "../utils/handleUserRegistration.js";  // Import the function
import validateSignupForm from "../utils/validateSignupForm";

export default function Signup() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");


    return (
    <div className="container">
      <div className="icon-wrapper">
        <MdEvent className="icon" />
      </div>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        validate={validateSignupForm}
        onSubmit={(values, { setSubmitting }) => {
            handleUserRegistration(values, setSubmitting, setErrorMessage, navigate);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-container">
            <h2 className='error-message'>
              {errorMessage}
            </h2>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="credentials-label"
              >
                Username
              </label>
              <Field
                type="username"
                id="username"
                name="username"
                className="credentials-field"
                placeholder="Ex: Daniel"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="credentials-label"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Ex: Daniel@gmail.com"
                className="credentials-field"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="credentials-label"
              >
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="credentials-field"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>
            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  defaultValue
                  className="checkbox-field"
                />
              </div>
              <label
                htmlFor="terms"
                className="remember-me-label"
              >
                I want it to{" "}
                <a
                  href="#"
                  className="remember-me-link"
                >
                  remember me
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
             Create Account
            </button>
            <br />

            <Link
              to={"/login"}
              className="signup-login-link"
            >
              Already have an account ? Login
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
}
