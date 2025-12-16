import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';

const RutasProtegidas = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutasProtegidas;