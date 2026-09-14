CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    profile_pic TEXT,
    date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    senderid INT REFERENCES users(id) ON DELETE CASCADE,
    receiverid INT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver_ts
ON messages (senderid, receiverid, timestamp DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_messages_receiver_sender_ts
ON messages (receiverid, senderid, timestamp DESC, id DESC);
