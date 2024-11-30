const request = require('supertest');
const app = require('../app');

describe('Task Submission', () => {
  it('should upload a file and return a job ID', async () => {
    const res = await request(app)
      .post('/tasks/upload')
      .attach('file', '__tests__/test.csv');
    expect(res.status).toBe(202);
    expect(res.body.jobId).toBeDefined();
  });
});

describe('Task Status', () => {
  it('should return the status of a task', async () => {
    const jobId = 'valid-job-id';
    const res = await request(app).get(`/tasks/${jobId}/status`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBeDefined();
  });
});