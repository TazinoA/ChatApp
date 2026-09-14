import { pool } from "../lib/db.js";
import bcrypt from "bcrypt";
import generateToken, { COOKIE_OPTIONS } from "../lib/utils.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

export async function signup(req, res) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid request payload" });
  }

  const { name, email, password, confirmPassword } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return res.status(400).json({ message: "All fields must be strings" });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords must match" });
  } else if (trimmedName.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters" });
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(trimmedName)) {
    return res.status(400).json({ message: "Please enter a valid name" });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters including 1 number" });
  }

  try {
    const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [trimmedEmail]);

    if (result.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING id, name, email, profile_pic`,
      [titleCase(trimmedName), trimmedEmail, password_hash]
    );

    const user = insertResult.rows[0];
    generateToken(user, res);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
      },
    });
  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid request payload" });
  }

  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [trimmedEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRow = result.rows[0];

    if (!userRow.password_hash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userRow.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = {
      id: userRow.id,
      email: userRow.email,
    };
    generateToken(user, res);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        profile_pic: userRow.profile_pic,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function googleSignupOrLogin(req, res) {
  const credential = req.body?.credential || req.body?.idToken || req.body?.token;

  if (!credential || typeof credential !== "string") {
    return res.status(400).json({ message: "Google ID token is required" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    if (!payload.email_verified) {
      return res.status(400).json({ message: "Google email is not verified" });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];

    let userResult = await pool.query(`SELECT id, name, email, profile_pic FROM users WHERE email = $1`, [email]);

    let user;
    if (userResult.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO users(name, email, password_hash, profile_pic) VALUES($1, $2, $3, $4) RETURNING id, name, email, profile_pic`,
        [titleCase(name), email, null, payload.picture || null]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    generateToken({ id: user.id, email: user.email }, res);

    return res.status(200).json({
      message: "Google login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
      },
    });
  } catch (e) {
    console.error("Google signup/login error:", e);
    return res.status(401).json({ message: "Invalid Google ID token" });
  }
}

export async function logout(req, res) {
  res.clearCookie("accessToken", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  return res.status(200).json({ message: "Logged out successfully" });
}

function titleCase(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
