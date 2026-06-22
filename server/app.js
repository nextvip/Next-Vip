import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import "./config/db.js";
import swaggerSpecs from "./config/swagger.js";
import authRouter from "./routes/authRouter.js";
import videoRouter from "./routes/videoRouter.js";
import publicationRouter from "./routes/publicationRouter.js";
import subscriptionRouter from "./routes/subscriptionRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "NextVIP API Documentation",
  })
);

app.use("/api/auth", authRouter);
app.use("/api/videos", videoRouter);
app.use("/api/publications", publicationRouter);
app.use("/api/subscriptions", subscriptionRouter);

// Local dev only — Vercel serves the client build from client/dist via CDN
const clientDistPath = path.join(__dirname, "../client/dist");
if (!process.env.VERCEL && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get("/*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/api-docs") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else if (!process.env.VERCEL) {
  app.get("/", (_, res) =>
    res.json({ message: `Welcome to ${process.env.PROJECT_NAME} backend.` })
  );
}

app.all("*", (_, res) =>
  res.status(404).json({ success: false, message: "Route not found", status: 404 })
);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    status: statusCode,
  });
});

export default app;
