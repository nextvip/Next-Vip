import { openaiConfig, isOpenAiConfigured } from "../config/openai.js";
import ErrorHandler from "../utils/errorHandler.js";
import { buildGenerationPrompt } from "../prompts/platformPrompts.js";

const parseJsonResponse = (text) => {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response was not valid JSON");
  }
  return JSON.parse(jsonMatch[0]);
};

export const generatePlatformContent = async ({
  platform,
  generationType,
  videoTitle,
  videoDescription,
  productName,
  language,
}) => {
  if (!isOpenAiConfigured()) {
    throw new ErrorHandler(
      "OpenAI is not configured. Add OPENAI_API_KEY to server environment.",
      503
    );
  }

  const prompt = buildGenerationPrompt({
    platform,
    generationType,
    videoTitle,
    videoDescription,
    productName,
    language,
  });

  const response = await fetch(`${openaiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openaiConfig.model,
      max_tokens: openaiConfig.maxTokens,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write viral social media copy. Always respond with valid JSON only, no markdown.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || `OpenAI request failed (${response.status})`;
    throw new ErrorHandler(message, response.status === 429 ? 429 : 502);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new ErrorHandler("Empty response from OpenAI", 502);
  }

  let parsed;
  try {
    parsed = parseJsonResponse(content);
  } catch {
    throw new ErrorHandler("Failed to parse AI response", 502);
  }

  const tokensUsed =
    data.usage?.total_tokens ||
    (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);

  return {
    result: parsed,
    model: data.model || openaiConfig.model,
    tokensUsed,
    prompt,
  };
};
