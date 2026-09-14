import { pool } from "../lib/db.js";

export async function updateProfilePic(req, res) {
  const { profilePic } = req.body;
  const { id: userId } = req.user;

  if (!profilePic || typeof profilePic !== "string") {
    return res.status(400).json({ message: "Profile picture payload is required" });
  }

  // Enforce small upload limit (~2MB in base64 is approx 2.8 million characters)
  if (profilePic.length > 3 * 1024 * 1024) {
    return res.status(400).json({ message: "Image size exceeds 2MB limit" });
  }

  // Validate image MIME-type if data URI
  if (profilePic.startsWith("data:")) {
    const validFormats = ["data:image/jpeg", "data:image/png", "data:image/webp", "data:image/jpg", "data:image/gif"];
    const isValidFormat = validFormats.some((fmt) => profilePic.startsWith(fmt));
    if (!isValidFormat) {
      return res.status(400).json({ message: "Invalid image format. Allowed formats: JPEG, PNG, WEBP, GIF" });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING id, name, email, profile_pic`,
      [profilePic, userId]
    );
    res.status(200).json({
      message: "Successfully updated profile photo",
      user: result.rows[0],
    });
  } catch (e) {
    console.error("Update profile pic error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getContacts(req, res) {
  const { id: userId } = req.user;
  const { search, page = 1, limit = 50 } = req.query;

  try {
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const parsedLimit = parseInt(limit, 10);

    if (search && search.trim() !== "") {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      const query = `
        SELECT id, name, email, profile_pic
        FROM users
        WHERE id != $1 AND (LOWER(name) LIKE $2 OR LOWER(email) LIKE $2)
        ORDER BY name ASC
        LIMIT $3 OFFSET $4
      `;
      const result = await pool.query(query, [userId, searchTerm, parsedLimit, offset]);
      return res.status(200).json({ contacts: result.rows });
    }

    // Default: Return user's conversations ordered by latest message
    const conversationsQuery = `
      WITH user_conversations AS (
        SELECT DISTINCT
          CASE WHEN senderid = $1 THEN receiverid ELSE senderid END AS other_user_id
        FROM messages
        WHERE senderid = $1 OR receiverid = $1
      ),
      last_messages AS (
        SELECT DISTINCT ON (
          CASE WHEN senderid = $1 THEN receiverid ELSE senderid END
        )
          CASE WHEN senderid = $1 THEN receiverid ELSE senderid END AS other_user_id,
          content AS last_message,
          timestamp AS last_message_time,
          senderid AS last_message_sender_id
        FROM messages
        WHERE senderid = $1 OR receiverid = $1
        ORDER BY CASE WHEN senderid = $1 THEN receiverid ELSE senderid END, timestamp DESC, id DESC
      )
      SELECT
        u.id,
        u.name,
        u.email,
        u.profile_pic,
        lm.last_message,
        lm.last_message_time,
        lm.last_message_sender_id
      FROM users u
      LEFT JOIN user_conversations uc ON u.id = uc.other_user_id
      LEFT JOIN last_messages lm ON u.id = lm.other_user_id
      WHERE u.id != $1
      ORDER BY lm.last_message_time DESC NULLS LAST, u.name ASC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(conversationsQuery, [userId, parsedLimit, offset]);
    res.status(200).json({ contacts: result.rows });
  } catch (e) {
    console.error("Get contacts/conversations error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
  const { id: userId } = req.user;
  const { receiverId } = req.params;
  const { beforeTimestamp, beforeId, limit = 50 } = req.query;

  const parsedReceiverId = Number(receiverId);
  if (!parsedReceiverId || isNaN(parsedReceiverId)) {
    return res.status(400).json({ message: "Invalid or missing receiver ID." });
  }

  try {
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
    let query;
    let queryParams;

    if (beforeTimestamp && beforeId) {
      query = `
        SELECT * FROM messages
        WHERE ((senderid = $1 AND receiverid = $2) OR (receiverid = $1 AND senderid = $2))
          AND (timestamp < $3 OR (timestamp = $3 AND id < $4))
        ORDER BY timestamp DESC, id DESC
        LIMIT $5
      `;
      queryParams = [userId, parsedReceiverId, beforeTimestamp, Number(beforeId), parsedLimit];
    } else {
      query = `
        SELECT * FROM messages
        WHERE ((senderid = $1 AND receiverid = $2) OR (receiverid = $1 AND senderid = $2))
        ORDER BY timestamp DESC, id DESC
        LIMIT $3
      `;
      queryParams = [userId, parsedReceiverId, parsedLimit];
    }

    const result = await pool.query(query, queryParams);
    // Reverse to return in chronological order
    const messages = result.rows.reverse();

    const hasMore = result.rows.length === parsedLimit;
    const oldestMessage = messages[0];

    res.status(200).json({
      messages,
      hasMore,
      nextCursor: oldestMessage
        ? { beforeTimestamp: oldestMessage.timestamp, beforeId: oldestMessage.id }
        : null,
    });
  } catch (e) {
    console.error("Get messages error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
