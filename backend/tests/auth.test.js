import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth_route.js";
import { pool } from "../lib/db.js";
import supertest from "supertest";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

test("POST /auth/signup - rejects non-string fields", async () => {
  const res = await supertest(app)
    .post("/auth/signup")
    .send({ name: 123, email: "test@example.com", password: "Password123", confirmPassword: "Password123" });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /strings/i);
});

test("POST /auth/signup - rejects password mismatch", async () => {
  const res = await supertest(app)
    .post("/auth/signup")
    .send({ name: "John Doe", email: "john@example.com", password: "Password123", confirmPassword: "Mismatch123" });

  assert.equal(res.status, 400);
  assert.equal(res.body.message, "Passwords must match");
});

test("POST /auth/login - returns generic 401 for invalid credentials", async () => {
  const originalQuery = pool.query;
  pool.query = async () => {
    return { rows: [] }; // Simulate user not found
  };

  try {
    const res = await supertest(app)
      .post("/auth/login")
      .send({ email: "nonexistent_user_9999@example.com", password: "Password123" });

    assert.equal(res.status, 401);
    assert.equal(res.body.message, "Invalid email or password");
    assert.equal(res.body.access_token, undefined, "JWT token should not be in JSON response");
  } finally {
    pool.query = originalQuery;
  }
});

test("POST /auth/google-oauth - rejects missing Google credential", async () => {
  const res = await supertest(app)
    .post("/auth/google-oauth")
    .send({});

  assert.equal(res.status, 400);
  assert.match(res.body.message, /Google ID token is required/i);
});
