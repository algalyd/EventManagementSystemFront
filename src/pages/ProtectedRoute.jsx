import { Navigate } from 'react-router-dom';
import { isAuthenticated }  from '../utils/auth'

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
    return (
        isAuthenticated() ? {...children} : <Navigate to="/login" />
    );
};

export default ProtectedRoute;