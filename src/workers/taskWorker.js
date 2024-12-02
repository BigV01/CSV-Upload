const { taskQueue } = require('../queues/taskQueue');
const { parseCSV } = require('../services/csvService');
const { saveData } = require('../services/dbService');

taskQueue.process(async (job) => {
  const { filePath } = job.data;
  try {
    const data = await parseCSV(filePath);
    await saveData(data);
    return { success: true };
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    throw error;
  }
});