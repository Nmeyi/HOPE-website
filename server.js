const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create a connection to the database
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'contact'
});

// Connect to the database
connection.connect((err) => {
if (err) {
console.error('Error connecting to the database:', err);
return;
}
console.log('Connected to the MySQL database!');
});

// Create an Express app
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies

// API endpoint to add a new user
app.post('/users', (req, res) => {
const { name, email } = req.body;

const query = 'INSERT INTO users (name, email, contactnumber, message) VALUES (?, ?)';
connection.query(query, [name, email], (error, results) => {
if (error) {
console.error('Error inserting user:', error);
return res.status(500).json({ error: 'Error inserting user' });
}
res.status(201).json({ id: results.insertId, name, email, contactnumber, message });
});
});

// API endpoint to retrieve all users
app.get('/users', (req, res) => {
const query = 'SELECT * FROM users';
connection.query(query, (error, results) => {
if (error) {
console.error('Error retrieving users:', error);
return res.status(500).json({ error: 'Error retrieving users' });
}
res.json(results);
});
});

// API endpoint to update a user
app.put('/users/:id', (req, res) => {
const userId = req.params.id;
const { name, email } = req.body;

const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
connection.query(query, [name, email, userId], (error, results) => {
if (error) {
console.error('Error updating user:', error);
return res.status(500).json({ error: 'Error updating user' });
}
if (results.affectedRows === 0) {
return res.status(404).json({ error: 'User not found' });
}
res.json({ id: userId, name, email });
});
});

// API endpoint to delete a user
app.delete('/users/:id', (req, res) => {
const userId = req.params.id;

const query = 'DELETE FROM users WHERE id = ?';
connection.query(query, [userId], (error, results) => {
if (error) {
console.error('Error deleting user:', error);
return res.status(500).json({ error: 'Error deleting user' });
}
if (results.affectedRows === 0) {
return res.status(404).json({ error: 'User not found' });
}
res.status(204).send(); // No content
});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

// Close the connection when the server stops
process.on('SIGINT', () => {
connection.end((err) => {
if (err) {
console.error('Error ending the database connection:', err);
}
console.log('Database connection closed.');
process.exit(0);
});
});