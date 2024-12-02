require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const multer = require('multer');
const taskController = require('./controllers/taskController'); // Import the task controller
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.post('/tasks/upload', upload.single('file'), taskController.uploadFile); // Upload and process CSV
app.get('/tasks/:id/status', taskController.getTaskStatus); // Get task status
app.get('/tasks/stats', taskController.getQueueStats); // Get queue stats

// Health Check
app.get('/', (req, res) => {
  res.send('CSV Processing API is running!');
});

// Serve static files (if needed, e.g., for a front-end)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});