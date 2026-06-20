import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT;
const serverUrl = process.env.API_BASE_URL;

const servers = [
  {
    url: serverUrl,
    description: isProduction
      ? "Production server"
      : "Development server",
  },
];

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NextVIP API",
      version: "1.0.0",
      description:
        "Backend API for **NextVIP** — an AI-powered content automation SaaS for creators, affiliate marketers, and businesses.\n\n" +
        "NextVIP automates the full content lifecycle: upload once, then distribute, optimize, engage audiences, and monetize across TikTok, Instagram, Facebook, and YouTube.\n\n" +
        "**Platform capabilities**\n" +
        "- **Video management** — upload, organize, and track publishing history\n" +
        "- **Social media integration** — OAuth connections to TikTok, Instagram, Facebook, and YouTube\n" +
        "- **AI content generation** — titles, descriptions, hashtags, and platform-specific copy via OpenAI\n" +
        "- **Comment & DM automation** — keyword triggers, public replies, and private DMs with template variables (`{link}`, `{product}`)\n" +
        "- **IF/THEN automation** — configurable rules (e.g. keyword comment → DM, upload → auto-publish, cross-post between networks)\n" +
        "- **Affiliate system** — manage links, associate products with videos, inject links into automated replies\n" +
        "- **Content scheduling** — schedule posts by date, time, and target platform\n" +
        "- **Subscriptions** — Free, Pro, and Business plans via Stripe\n\n" +
        "**Currently implemented**: authentication (sign up, login, email verification), user profile management, and password reset. " +
        "Additional modules will be added as routes are built. Used by the NextVIP web dashboard and mobile app.",
    },
    servers,
    components: {
      securitySchemes: {
        accessTokenAuth: {
          type: "apiKey",
          in: "header",
          name: "access-token",
          description:
            "Optional: paste token here. If you login via Swagger, the token is stored in a cookie and sent automatically—no need to use the lock.",
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description:
          "Sign up, login, email activation, and token refresh. Entry point for creators and businesses onboarding to NextVIP.",
      },
      {
        name: "User Management",
        description:
          "Profile and account settings for NextVIP users — connected social accounts, automation preferences, and dashboard configuration.",
      },
      {
        name: "Password Management",
        description:
          "Forgot password, reset via email, and change password from account settings.",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

export default specs;
