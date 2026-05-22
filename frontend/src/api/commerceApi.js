import apiClient from "./client.js";

export const getProducts = async (params = {}) => {
  const response = await apiClient.get("/products", { params });
  return response.data.data;
};

export const createProduct = async (product) => {
  const response = await apiClient.post("/products", product);
  return response.data.data;
};

export const updateProduct = async (id, product) => {
  const response = await apiClient.put(`/products/${id}`, product);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data.data;
};

export const getInventory = async () => {
  const response = await apiClient.get("/inventory");
  return response.data.data;
};

export const getAnalytics = async () => {
  const response = await apiClient.get("/analytics");
  return response.data.data;
};

export const getRevenueAnalytics = async () => {
  const response = await apiClient.get("/analytics/revenue");
  return response.data.data;
};

export const getProductAnalytics = async () => {
  const response = await apiClient.get("/analytics/products");
  return response.data.data;
};

export const getInventoryAnalytics = async () => {
  const response = await apiClient.get("/analytics/inventory");
  return response.data.data;
};

export const getAssistantInsights = async () => {
  const response = await apiClient.get("/assistant/insights");
  return response.data.data;
};

export const askAssistant = async (prompt) => {
  const response = await apiClient.post("/assistant/ask", { prompt });
  return response.data.data;
};
