import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check if user is authenticated based on stored token
  const checkAuth = async () => {
    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    } catch (error) {
      console.log("Auth check error:", error);
      setIsLogged(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token } = response.data;
      await AsyncStorage.setItem("accessToken", access_token);

      return access_token;
    } catch (error) {
      console.log("Token refresh error:", error);
      throw error;
    }
  };

  // Function to login and store tokens
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        username,
        password,
      });

      const { access_token, refresh_token } = response.data;
      await AsyncStorage.setItem("accessToken", access_token);
      await AsyncStorage.setItem("refreshToken", refresh_token);

      setIsLogged(true);
    } catch (error) {
      console.log("Login error:", error);
      setIsLogged(false);
    }
  };

  // Function to log out and clear tokens
  const logout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    setIsLogged(false);
  };

  // Axios request interceptor to handle expired tokens and refresh them
  axios.interceptors.request.use(
    async (config) => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Axios response interceptor to refresh token on 401
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);  // Retry the original request with new token
        } catch (err) {
          console.log("Refresh token failed", err);
          // If token refresh fails, log out the user
          logout();
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
