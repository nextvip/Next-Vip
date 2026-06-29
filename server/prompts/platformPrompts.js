export const PLATFORMS = ["tiktok", "instagram", "facebook", "youtube"];

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
];

const LANGUAGE_LABELS = Object.fromEntries(
  SUPPORTED_LANGUAGES.map(({ code, label }) => [code, label])
);

export const getLanguageLabel = (code) =>
  LANGUAGE_LABELS[code] || LANGUAGE_LABELS.en;

const PLATFORM_GUIDELINES = {
  tiktok: {
    label: "TikTok",
    title: "Short, punchy, curiosity-driven. Max ~80 characters. Use hooks and trending language.",
    description:
      "Casual, energetic tone. 1-3 short lines. Encourage saves/shares. Mention product benefit briefly.",
    hashtags: "8-12 hashtags mixing trending + niche. Include #fyp #foryou when relevant.",
    maxTitleLength: 80,
  },
  instagram: {
    label: "Instagram Reels",
    title: "Engaging, aesthetic. Max ~100 characters. Emoji-friendly.",
    description:
      "Conversational caption with line breaks. Strong CTA (link in bio / comment INFO). 2-4 short paragraphs max.",
    hashtags: "15-25 hashtags. Mix popular and specific. Place at end of caption or separate block.",
    maxTitleLength: 100,
  },
  facebook: {
    label: "Facebook",
    title: "Clear and benefit-focused. Max ~120 characters.",
    description:
      "Friendly, informative. Slightly longer than TikTok. Include CTA to comment or message for details.",
    hashtags: "3-8 hashtags. Less critical than IG; keep relevant to product/niche.",
    maxTitleLength: 120,
  },
  youtube: {
    label: "YouTube Shorts",
    title: "SEO-friendly, keyword-rich. Max ~100 characters.",
    description:
      "Descriptive with keywords for search. Include CTA. Mention what viewer will learn or get.",
    hashtags: "3-5 tags as hashtags (#shorts plus niche tags).",
    maxTitleLength: 100,
  },
};

export const getPlatformGuidelines = (platform) => {
  const key = PLATFORMS.includes(platform) ? platform : "tiktok";
  return PLATFORM_GUIDELINES[key];
};

export const buildGenerationPrompt = ({
  platform,
  generationType,
  videoTitle,
  videoDescription,
  productName,
  language = "en",
}) => {
  const guidelines = getPlatformGuidelines(platform);
  const languageLabel = getLanguageLabel(language);
  const context = [
    videoTitle && `Video title: ${videoTitle}`,
    videoDescription && `Video description: ${videoDescription}`,
    productName && `Product: ${productName}`,
    `Output language: ${languageLabel} — write ALL title, description, and hashtag text in ${languageLabel} only.`,
  ]
    .filter(Boolean)
    .join("\n");

  const base = `You are a social media copywriter for ${guidelines.label}.
${context}

Platform rules:
- Title style: ${guidelines.title}
- Description style: ${guidelines.description}
- Hashtag style: ${guidelines.hashtags}`;

  if (generationType === "title") {
    return `${base}

Generate ONLY a compelling post title. Return JSON: {"title":"..."}`;
  }

  if (generationType === "description") {
    return `${base}

Generate ONLY a post description/caption. Return JSON: {"description":"..."}`;
  }

  if (generationType === "hashtags") {
    return `${base}

Generate ONLY hashtags (with # prefix). Return JSON: {"hashtags":["#tag1","#tag2"]}`;
  }

  return `${base}

Generate title, description, and hashtags adapted for ${guidelines.label}.
Return JSON only:
{"title":"...","description":"...","hashtags":["#tag1","#tag2"]}`;
};
