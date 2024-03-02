import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DB_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET all events", () => {
  test("should return all events", async () => {
    const res = await request(app).get("/events/all")
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
  })
})

describe("GET all users without authentication", () => {
  test("should return unauthorised", async () => {
    const res = await request(app).get("/users/all")
    expect(res.statusCode).toBe(401)
    expect(res.body).toBeDefined()
  })
})

describe("Register new user", () => {
  test("should return 'User created successfully'", async () => {
    const testUser = {username: "Testing Account 19", password: "Abcd123!"}
    const res = await request(app)
        .post("/auth/register")
        .send(testUser)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.message).toBe("User created successfully")
  })
})

describe("Successful sign in", () => {
  test("should return status code 200", async () => {
    const testUser = {username: "Testing Account 19", password: "Abcd123!"}
    const res = await request(app)
        .post("/auth/login")
        .send(testUser)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
    expect(res.body.message).toBe("Sign in successful")
  })
})

describe("Successful sign out", () => {
  test("should return status code 204", async () => {
    const testUser = {username: "Testing Account 19", password: "Abcd123!"}
    const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: "1h" })
    const res = await request(app)
        .delete("/auth/logout")
        .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(204)
  })
})