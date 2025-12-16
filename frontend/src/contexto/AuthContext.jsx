import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  //INICIALIZACIÓN INTELIGENTE
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('usuario_datos');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token);
  const [loading, setLoading] = useState(false);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // DATOS
      const userData = { 
        id: data.userId, 
        email: data.email, 
        nombre: data.nombre
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario_datos', JSON.stringify(userData)); 
      
      setToken(data.token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (nombre, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      const userData = { id: data.userId, email, nombre };

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario_datos', JSON.stringify(userData));
      
      setToken(data.token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_datos');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};