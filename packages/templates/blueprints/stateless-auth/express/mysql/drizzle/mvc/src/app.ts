import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFoundHandler } from "./middlewares/not-found-handler";
import { errorHandler } from "./middlewares/error-handler";
import Routes from "./routes/index";
import { startRefreshTokenCleanupJob } from "./cron/cleanup-refresh-tokens.cron";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import { rateLimiter } from "./middlewares/rate-limiter";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Routes

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/v1/health");
});

app.use("/api", Routes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
startRefreshTokenCleanupJob();

app.get(["/docs-json", "/api-docs-json"], (req: Request, res: Response) => {
  res.json(swaggerDocument);
});

app.use(rateLimiter);

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
