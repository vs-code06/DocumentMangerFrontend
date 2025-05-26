import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Set default Authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // ✅ Memoize logout to avoid dependency warning
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Verify token on load or token change
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired
            logout();
            return;
          }

          // Token valid, fetch user profile
          const response = await axios.get('/api/profile/');
          setUser(response.data);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, logout]); // ✅ logout included safely

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login/', {
        username: email,
        password,
      });

      const { access } = response.data;
      localStorage.setItem('token', access);
      setToken(access);

      const userResponse = await axios.get('/api/profile/');
      setUser(userResponse.data);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  const register = async (name, email, password) => {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const response = await axios.post('/api/auth/register/', {
        username: email,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      const { access, user } = response.data;
      localStorage.setItem('token', access);
      setToken(access);
      setUser(user);

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      let errorMessage = 'Registration failed';

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          errorMessage = Object.entries(data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(' ') : errors}`)
            .join('\n');
        } else {
          errorMessage = data.toString();
        }
      }

      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
