import { pool } from "../lib/db.js";
import bcrypt from "bcrypt";
import generateToken from "../lib/utils.js";

async function signup(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  // Server-side validation
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords must match" });
  } else if (name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters" });
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(name)) {
    return res.status(400).json({ message: "Please enter a valid name" });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters including 1 number" });
  }

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length > 0) {
      return res.status(409).json({ message: "User already exists, go to the login page" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3)`,
      [name, email, password_hash]
    );

    const userResult = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    const user = { id: userResult.rows[0].id };
    const token = generateToken(user, res);

    return res.status(200).json({ access_token: token });
  } catch (e) {
    return res.status(500).json({
      message: `There was an error signing you up, please try again later.`,
      error: e.message,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User does not exist, go to the signup page" });
    }

    const userRow = result.rows[0];
    const isMatch = await bcrypt.compare(password, userRow.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const user = { id: userRow.id };
    const token = generateToken(user, res);

    return res.status(200).json({ access_token: token });
  } catch (e) {
    return res.status(500).json({
      message: "There was an error logging you in, please try again later.",
      error: e.message,
    });
  }
}

export { signup, login };
