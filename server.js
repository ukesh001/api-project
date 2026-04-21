const express = require('express');
const cors = require('cors');  // Import CORS
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Create a new SQLite database or open the existing one
const db = new sqlite3.Database('./weblinks.db');

// Create the table if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS weblinks (id INTEGER PRIMARY KEY, url TEXT, description TEXT)");
});

// Get all weblinks
app.get('/weblinks', (req, res) => {
    db.all("SELECT * FROM weblinks", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);  // Return all the weblinks as JSON
    });
});

// Add a new weblink
app.post('/weblinks', (req, res) => {
    const { url, description } = req.body;
    const stmt = db.prepare("INSERT INTO weblinks (url, description) VALUES (?, ?)");

    stmt.run(url, description, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, url, description });  // Return the newly created weblink
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
