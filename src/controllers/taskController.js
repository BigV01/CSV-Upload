const { taskQueue } = require('../queues/taskQueue');
const fs = require('fs/promises');

/**
 * Submit a task by uploading a CSV file.
 * @route POST /tasks/upload
 */
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;

    // Validate file existence and type
    if (!file || file.mimetype !== 'text/csv') {
      return res.status(400).json({ message: 'Invalid file type. Please upload a CSV file.' });
    }

    // Add the file to the task queue
    const job = await taskQueue.add({ filePath: file.path });

    res.status(202).json({
      message: 'File submitted successfully.',
      jobId: job.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Get the status of a specific task.
 * @route GET /tasks/:id/status
 */
exports.getTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the job from the queue
    const job = await taskQueue.getJob(id);

    if (!job) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Respond with task details and status
    res.json({
      id: job.id,
      status: job.finishedOn ? 'completed' : job.failedOn ? 'failed' : 'processing',
      submittedAt: new Date(job.timestamp),
      completedAt: job.finishedOn ? new Date(job.finishedOn) : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Get statistics for the task queue.
 * @route GET /tasks/stats
 */
exports.getQueueStats = async (req, res) => {
  try {
    // Retrieve stats from the queue
    const activeJobs = await taskQueue.getActiveCount();
    const waitingJobs = await taskQueue.getWaitingCount();
    const completedJobs = await taskQueue.getCompletedCount();
    const failedJobs = await taskQueue.getFailedCount();

    res.json({
      active: activeJobs,
      waiting: waitingJobs,
      completed: completedJobs,
      failed: failedJobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch queue stats.' });
  }
};
