// backend/ai/chatResponses.js

export const GREETING_REPLY =
  "Hi 👋 I'm your Project Management Assistant. Ask me about projects, customers, or documents.";

export const SMALL_TALK_REPLY =
  "I'm here to help you manage projects 📁. Try asking:\n• Show projects for Ather\n• Open latest project for Rockwell\n• Show dashboard stats";

export const OUT_OF_SCOPE_REPLY =
  "I can help only with project management related information.";

export const HELP_REPLY =
  "I'm not sure what you meant 🤔\nTry:\n• Show dashboard stats\n• Show projects for a customer\n• Open latest project for a customer";

// Attach contextual explanation for UI (non-breaking)
// Prefer a concise "Based on: <entity|page>" style.
// memory.currentEntity should already be sanitized by the controller.
export const withContextStrip = (reply, context = {}, memory = {}) => {
  let contextStrip = null;

  if (memory?.currentEntity) {
    contextStrip = `Based on: ${memory.currentEntity}`;
  }

  return { reply, contextStrip };
};
  