import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DB_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /events/all", () => {
  test("should return all events", async () => {
    const res = await request(app).get("/events/all")
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
  })
})
