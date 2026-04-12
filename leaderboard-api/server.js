const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Database setup ---
// Use /tmp on Render (writable), local dir otherwise
const dbPath = process.env.RENDER
    ? '/tmp/leaderboard.db'
    : path.join(__dirname, 'leaderboard.db');

const db = new Database(dbPath);

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        chapter INTEGER NOT NULL CHECK(chapter BETWEEN 1 AND 4),
        score INTEGER NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_scores_chapter_score
        ON scores(chapter, score DESC);
`);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---

// Submit a score
app.post('/api/scores', (req, res) => {
    const { player_name, chapter, score, details } = req.body;

    if (!player_name || !chapter || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields: player_name, chapter, score' });
    }

    if (typeof player_name !== 'string' || player_name.length > 30) {
        return res.status(400).json({ error: 'player_name must be a string under 30 characters' });
    }

    const ch = parseInt(chapter);
    if (ch < 1 || ch > 4) {
        return res.status(400).json({ error: 'chapter must be 1-4' });
    }

    const s = parseInt(score);
    if (isNaN(s) || s < 0) {
        return res.status(400).json({ error: 'score must be a non-negative number' });
    }

    const detailsStr = details ? JSON.stringify(details) : null;

    const stmt = db.prepare(
        'INSERT INTO scores (player_name, chapter, score, details) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(player_name, ch, s, detailsStr);

    res.json({
        id: result.lastInsertRowid,
        message: 'Score submitted!'
    });
});

// Get leaderboard for a chapter (top 20)
app.get('/api/leaderboard/:chapter', (req, res) => {
    const ch = parseInt(req.params.chapter);
    if (ch < 1 || ch > 4) {
        return res.status(400).json({ error: 'chapter must be 1-4' });
    }

    const rows = db.prepare(
        `SELECT player_name, score, details, created_at
         FROM scores
         WHERE chapter = ?
         ORDER BY score DESC
         LIMIT 20`
    ).all(ch);

    // Parse details back to JSON
    const leaderboard = rows.map((row, i) => ({
        rank: i + 1,
        player_name: row.player_name,
        score: row.score,
        details: row.details ? JSON.parse(row.details) : null,
        created_at: row.created_at
    }));

    res.json({ chapter: ch, leaderboard });
});

// Get overall leaderboard (combined score across all chapters)
app.get('/api/leaderboard', (req, res) => {
    const rows = db.prepare(
        `SELECT player_name, SUM(score) as total_score, COUNT(DISTINCT chapter) as chapters_played
         FROM (
             SELECT player_name, chapter, MAX(score) as score
             FROM scores
             GROUP BY player_name, chapter
         )
         GROUP BY player_name
         ORDER BY total_score DESC
         LIMIT 20`
    ).all();

    const leaderboard = rows.map((row, i) => ({
        rank: i + 1,
        player_name: row.player_name,
        total_score: row.total_score,
        chapters_played: row.chapters_played
    }));

    res.json({ leaderboard });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', scores: db.prepare('SELECT COUNT(*) as n FROM scores').get().n });
});

// --- Start ---
app.listen(PORT, () => {
    console.log(`Leaderboard API running on port ${PORT}`);
});
