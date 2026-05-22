import apiClient from "./client.js";

export const generateAIContent = async (type, payload) => {
  const response = await apiClient.post(`/ai/generate/${type}`, payload);
  return response.data.data;
};
