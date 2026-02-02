// backend/ai/chatPolicy.js
export const isGreeting = (msg) =>
  /^(hi|hello|hey|good morning|good evening|who are you|can you assist me)/i.test(
    msg,
  );

export const isSmallTalk = (msg) =>
  /how are you|what can you do|help me|what do you do/i.test(msg);

export const isOutOfScope = (msg) =>
  /weather|joke|politics|movie|cricket|news|sports/i.test(msg);
