import express from "express";
import payload from "payload";
import { seed } from "./seed";

const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  if (process.env.PAYLOAD_SEED === "true") {
    payload.logger.info("---- SEEDING DATABASE ----");
    await seed(payload);
  }

  // Add your own express routes here

  app.listen(3000);
};

start();
