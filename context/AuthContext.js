import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWorker, setIsWorker] = useState(false);

  // URL base de la API - usar IP de la computadora para conexión móvil
  const API_BASE_URL = 'http://192.168.1.14:5000/api';

  // Verificar si el usuario está autenticado al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('krizo_token');
      const storedUser = await AsyncStorage.getItem('krizo_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsWorker(['mechanic', 'crane_operator', 'shop_owner'].includes(JSON.parse(storedUser).userType));
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login normal para clientes
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('🔐 Intentando login con:', { email, password });
      console.log('🌐 URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Status:', response.status);
      const data = await response.json();
      console.log('📥 Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      if (data.success) {
        const userData = data.data.user;
        const userToken = data.data.token;

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('krizo_token', userToken);
        await AsyncStorage.setItem('krizo_user', JSON.stringify(userData));

        // Actualizar estado
        setToken(userToken);
        setUser(userData);
        setIsWorker(['mechanic', 'crane_operator', 'shop_owner'].includes(userData.userType));

        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login específico para trabajadores
  const workerLogin = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/worker-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login de trabajador');
      }

      if (data.success) {
        const userData = data.data.user;
        const userToken = data.data.token;

        // Verificar que sea un trabajador
        if (!['mechanic', 'crane_operator', 'shop_owner'].includes(userData.userType)) {
          throw new Error('Esta cuenta no es de un trabajador');
        }

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('krizo_token', userToken);
        await AsyncStorage.setItem('krizo_user', JSON.stringify(userData));

        // Actualizar estado
        setToken(userToken);
        setUser(userData);
        setIsWorker(true);

        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Error en el login de trabajador');
      }
    } catch (error) {
      console.error('Error en worker login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Registro de usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      
      console.log('📝 Intentando registro con:', userData);
      
      // Preparar datos para el registro (sin la imagen si existe)
      const { documentImage, ...registrationData } = userData;
      
      console.log('🌐 URL:', `${API_BASE_URL}/auth/register`);
      console.log('📦 Datos finales:', registrationData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('📥 Status:', response.status);
      const data = await response.json();
      console.log('📥 Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      if (data.success) {
        const newUser = data.data.user;
        const userToken = data.data.token;

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('krizo_token', userToken);
        await AsyncStorage.setItem('krizo_user', JSON.stringify(newUser));

        // Actualizar estado
        setToken(userToken);
        setUser(newUser);
        setIsWorker(['mechanic', 'crane_operator', 'shop_owner'].includes(newUser.userType));

        return { success: true, user: newUser };
      } else {
        throw new Error(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('krizo_token');
      await AsyncStorage.removeItem('krizo_user');
      
      setToken(null);
      setUser(null);
      setIsWorker(false);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Función para hacer requests autenticados
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el token expiró, hacer logout
        if (response.status === 401) {
          await logout();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en apiRequest:', error);
      throw error;
    }
  };

  // Verificar email
  const verifyEmail = async (userId, verificationCode) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la verificación');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error en verificación:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código de verificación
  const resendVerification = async (userId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error reenviando código');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error reenviando código:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verificar email con código (usando email)
  const verifyEmailWithCode = async (email, verificationCode) => {
    try {
      setLoading(true);
      
      console.log('🔍 Verificando email con:', { email, verificationCode });
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error en la verificación');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error en verificación:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código de verificación (usando email)
  const resendVerificationCode = async (email) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error reenviando código');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error reenviando código:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isWorker,
    login,
    workerLogin,
    register,
    verifyEmail,
    resendVerification,
    verifyEmailWithCode,
    resendVerificationCode,
    logout,
    apiRequest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 