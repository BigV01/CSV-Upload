const express = require('express');
const multer = require('multer');
const taskController = require('./controllers/taskController');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Task routes
app.post('/tasks/upload', upload.single('file'), taskController.uploadFile);
app.get('/tasks/:id/status', taskController.getTaskStatus);
app.get('/tasks/stats', taskController.getQueueStats);

// Default health check
app.get('/', (req, res) => res.send('CSV Processing Queue System API is running!'));

module.exports = app;








