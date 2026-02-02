// backend/ai/chatConfidence.js
export const withConfidence = (reply, confidence = "high") => {
  if (confidence === "low") {
    return `I might be mistaken, but here’s what I found:\n\n${reply}`;
  }

  if (confidence === "medium") {
    return `${reply}\n\nLet me know if this looks correct.`;
  }

  return reply;
};
