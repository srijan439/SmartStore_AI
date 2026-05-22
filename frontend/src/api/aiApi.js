import apiClient from "./client.js";

const aiRequestTimeoutMs = 60000;

export const generateAIContent = async (type, payload) => {
  const response = await apiClient.post(`/ai/generate/${type}`, payload, {
    timeout: aiRequestTimeoutMs
  });
  return response.data.data;
};
