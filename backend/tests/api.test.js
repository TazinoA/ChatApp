import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "../routes/api_route.js";
import { verifyToken } from "../lib/utils.js";
import supertest from "supertest";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", verifyToken, apiRouter);

test("GET /api/get-contacts - rejects unauthenticated requests with 401", async () => {
  const res = await supertest(app).get("/api/get-contacts");
  assert.equal(res.status, 401);
  assert.equal(res.body.isValid, false);
});

test("GET /api/get-messages/:receiverId - rejects unauthenticated requests with 401", async () => {
  const res = await supertest(app).get("/api/get-messages/123");
  assert.equal(res.status, 401);
  assert.equal(res.body.isValid, false);
});

test("POST /api/update-profile - rejects unauthenticated requests with 401", async () => {
  const res = await supertest(app)
    .post("/api/update-profile")
    .send({ profilePic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" });

  assert.equal(res.status, 401);
  assert.equal(res.body.isValid, false);
});
