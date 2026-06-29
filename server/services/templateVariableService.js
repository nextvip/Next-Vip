export const TEMPLATE_VARIABLES = [
  { key: "username", label: "Commenter username", example: "albert_daz" },
  { key: "tiktok_link", label: "TikTok product link", example: "https://..." },
  { key: "amazon_link", label: "Amazon affiliate link", example: "https://..." },
  { key: "whatsapp", label: "WhatsApp number", example: "+1 570 241 4290" },
  { key: "product", label: "Product name", example: "Wireless earbuds" },
  { key: "link", label: "Primary affiliate link", example: "https://..." },
];

export const DEFAULT_PUBLIC_REPLY =
  "¡Hola! Te envié todos los detalles por mensaje privado 📩✨";

export const DEFAULT_PRIVATE_DM = `¡Hola {username} 👋🥰
Gracias por tu interés en este producto 🛍️✨
Te recomiendo comprarlo 🛒directamente desde este enlace de TikTok porque normalmente tiene el mejor precio y puede salir más económico 💰👇
{tiktok_link}

Si estás fuera de Estados Unidos 🇺🇸 o no te aparece disponible en TikTok Shop, también puedes comprarlo por Amazon aquí👇👇👇
{amazon_link}

Si tienes algún problema para comprarlo o no te aparece disponible, escríbeme por WhatsApp y con gusto te ayudo 📲😊

WhatsApp: {whatsapp}
¡Gracias por apoyar! 🙌✨`;

export const resolveTemplate = (template, variables = {}) => {
  if (!template) return "";
  let result = template;
  for (const { key } of TEMPLATE_VARIABLES) {
    const value = variables[key] ?? "";
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
};

export const commentMatchesKeywords = (commentText, keywords = []) => {
  const text = (commentText || "").toLowerCase().trim();
  if (!keywords.length || keywords.includes("*")) return true;

  return keywords.some((kw) => {
    const keyword = (kw || "").toLowerCase().trim();
    if (!keyword || keyword === "*") return true;
    return text.includes(keyword);
  });
};
