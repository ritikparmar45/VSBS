import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();//it is used to create a context object whose name is AuthContext

// Use relative API URL to work with Vite proxy
const API_URL = '/api';

// automatically set the Authorization header for all requests
// this interceptor will add the token to the header of every request made by axios
// this is useful for authenticated requests
// so we don't have to manually add the token to every request
// it will check if the token is present in localStorage and if it is, it will
// add it to the Authorization header of the request
// if the token is not present, it will not add the Authorization header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');// get the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;// if the token is present, add it to the Authorization header
  }
  return config;// return the config object so that the request can be made
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);// this use to store the user data after login or registration
  const [token, setToken] = useState(localStorage.getItem('token'));// this use to store the token after login or registration
  const [loading, setLoading] = useState(true);// this use to show the loading state while checking if the user is logged in or not

  useEffect(() => { //we use it because whenever user refresh the page or open again the page,so automatically check if the user is logged in or not
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');//take the token from localStorage
      if (storedToken) {
        try {
          //we take user information from the backend using the token
          const response = await axios.get(`${API_URL}/auth/me`); // we can use await axios.get('/api/auth/me')
          setUser(response.data.user);// set the user data in state
          setToken(storedToken);// set the token in state
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);// set loading to false after checking the token
    };

    initAuth();
  }, []);// [] the meaning of this empty array is that this useEffect will run only once when the component mounts

  const login = async (email, password) => {// this function is used to make connection between login form and backend
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);// set the token in state
      setUser(userData);// set the user data in state
      //this two lines show us user login successfully and we can use this user data in the whole application
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



//we used this authcontext to proide login, register, logout and user data to the whole application