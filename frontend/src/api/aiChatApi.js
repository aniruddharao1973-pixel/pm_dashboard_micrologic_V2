// frontend/src/api/aiChatApi.js
import { useAxios } from "./axios";

/**
 * AI Chat API
 * Admin / TechSales only (backend enforced)
 */
export const useAiChatApi = () => {
  const api = useAxios();

  /**
   * Send message to AI
   * @param {string} message
   * @param {object} context
   */
  const sendMessage = (
    message,
    context = { type: "dashboard" },
    conversationId = null,
  ) => {
    return api.post("/ai/chat", {
      message,
      context,
      conversationId,
    });
  };

  return {
    sendMessage,
  };
};
