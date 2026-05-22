import apiClient from "./client.js";

export const signup = async (payload) => {
  const response = await apiClient.post("/auth/signup", payload);
  return response.data.data;
};

export const login = async (payload) => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data.data.user;
};
