const Bull = require('bull');
const taskQueue = new Bull('csv-task-queue', { redis: { host: 'localhost', port: 6379 } });

taskQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

module.exports = { taskQueue };