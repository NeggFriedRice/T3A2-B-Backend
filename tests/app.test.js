import mongoose from "mongoose"
import request from "supertest"
import app from "../app.js"
import bodyParser from "body-parser"

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DB_URI)
})

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close()
})

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
