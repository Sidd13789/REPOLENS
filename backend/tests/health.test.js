import request from "supertest";
import express from "express";
import healthRoutes from "../routes/healthRoutes.js";

// Minimal app instance — doesn't touch MongoDB, so this runs without a
// database connection (unlike most controllers, which do need one).
const app = express();
app.use("/api/health", healthRoutes);

describe("GET /api/health", () => {
  test("returns success: true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
