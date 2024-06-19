import { MdEvent } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import useLogin from '../utils/useLogin';
import './Login.css';

export default function Login() {
    const { loginUser, errorMessage } = useLogin();


    return (
    <div className="container">
    <div className="icon-wrapper">
      <MdEvent className="icon" />
    </div>
    <Formik
       initialValues={{ username: '', password: '' }}
       validate={values => {
         const errors = {};

         if(!values.username || values?.username?.length < 3){
          errors.username = "Enter username."
         }
         if(!values.password){
          errors.password = "Enter password."
         }

         return errors;
       }}
       onSubmit={(values, { setSubmitting }) => {
        loginUser(values,setSubmitting)
       }}
     >
       {({ isSubmitting }) => (
      <Form className="form-container">
      <h2 className='error-message'>{errorMessage}</h2>
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
          placeholder="username or email"
        />
        <ErrorMessage name="username" component="div" className="error-message" />
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
        <ErrorMessage name="password" component="div" className="error-message" />
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
          I want it to {" "}
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
        Login
      </button>
      <br />

      <Link to={"/signup"} className="signup-login-link">
            {`Don't`} have an account ? Register
      </Link>
      </Form>
      )}
    </Formik>
    </div>
  );
}
