import apiClient from "./client.js";

export const getBackendHealth = async () => {
  const { data } = await apiClient.get("/health");
  return data;
};
