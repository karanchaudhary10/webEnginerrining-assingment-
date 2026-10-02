import express from "express";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { requestId } from "./middleware/request-id.js";
import { requestLogger } from "./middleware/request-logger.js";
import { usersRouter } from "./routes/users.routes.js";

// NEW imports for books
import { createBooksController } from "./controllers/books.controller.js";
import { createBooksRouter } from "./routes/books.routes.js";
import { BooksService } from "./services/books.service.js";
import { BooksRepository } from "./repositories/books.repository.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", "loopback");

  // ── 1. Pre-route middleware ──
  app.use(requestId);
  if (!config.isTest) app.use(requestLogger);
  app.use(express.json({ limit: config.bodyLimit }));

  // ── 2. Routes ──
  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptimeSec: Math.round(process.uptime()) });
  });
  app.use("/api/v1/users", usersRouter);

  // NEW: mount books router
  const booksService = new BooksService(new BooksRepository());
  const booksController = createBooksController(booksService);
  const booksRouter = createBooksRouter(booksController);
  app.use("/api/v1/books", booksRouter);

  // ── 3. Fallbacks ──
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
