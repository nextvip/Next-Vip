export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 1024,
  baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
};

export const isOpenAiConfigured = () => Boolean(openaiConfig.apiKey);
