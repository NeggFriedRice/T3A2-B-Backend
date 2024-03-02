import request from "supertest"
import jwt from "jsonwebtoken"
import app from "../app.js"
import { User } from "../db.js"

describe("token authentication", () => {
    let token

    beforeEach(() => {
        // Mock user and sign a token
        const user = { id: 1, name: "Test User" }
        token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" })
    })

    test("should return 200 if token is valid", async () => {
        const res = await request(app).get("/auth/protected-route").set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
    })

    test("should return 401 if no token is provided", async () => {
        const res = await request(app).get("/auth/protected-route")
        expect(res.statusCode).toBe(401)
    })

    test("should return 401 if token expired", async () => {
        // Sign a token with a short expiry time
        const expiredToken = jwt.sign({ id: 1, name: "Test User" }, process.env.JWT_SECRET, { expiresIn: "1ms" })

        // Wait for the token to expire
        await new Promise((resolve) => setTimeout(resolve, 2))

        const res = await request(app)
            .get("/auth/protected-route") // replace with your protected route
            .set("Authorization", `Bearer ${expiredToken}`)

        expect(res.statusCode).toBe(401)
        expect(res.body.error).toBe("Token expired")
    })

    test("should return 403 if token is invalid", async () => {
        const res = await request(app)
            .get("/auth/protected-route") // replace with your protected route
            .set("Authorization", "Bearer invalidtoken")

        expect(res.statusCode).toBe(403)
    })

    test("should return 403 if user has insufficient permissions", async () => {
        const res = await request(app)
            .get("/auth/admin-protected-route") // replace with your protected route
            .set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(403)
        expect(res.body.error).toBe("Insufficient permissions")
    })

    test("should return 200 if token is not expired", async () => {
        const res = await request(app).post("/auth/decode").set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.expired).toBe(false)
    })
})

describe("user login authentication", () => {
    let token

    beforeEach(() => {
        // Mock user and sign a token
        const user = { name: "administrator", password: "admin" }
        token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" })
    })

    test("should return 200 if user is authenticated and logout", async () => {
        const loginRes = await request(app).post("/auth/login").send({ username: "administrator", password: "admin" })

        expect(loginRes.statusCode).toBe(200)
        expect(loginRes.body.user).toBeDefined()
        expect(loginRes.body.accessToken).toBeDefined()
        expect(loginRes.body.refreshToken).toBeDefined()

        const logoutRes = await request(app).delete("/auth/logout").send({ token: loginRes.body.refreshToken })

        expect(logoutRes.statusCode).toBe(204)
    })

    test("should return 400 if user is not authenticated", async () => {
        const res = await request(app).post("/auth/login").send({ username: "invaliduser", password: "admin" })

        expect(res.statusCode).toBe(400)
    })

    test("should return 400 if user is not authenticated", async () => {
        const res = await request(app).post("/auth/login").send({ username: "administrator", password: "invalidpassword" })

        expect(res.statusCode).toBe(400)
    })

    test("should return 204 if user logs out", async () => {
        const res = await request(app).delete("/auth/logout").send({ token: "refreshtoken" })

        expect(res.statusCode).toBe(204)
    })
})

describe("user registration", () => {
    test("should return 200 if user is registered", async () => {
        const res = await request(app).post("/auth/register").send({ username: "newuser", password: "newpassword" })

        expect(res.statusCode).toBe(200)
    })

    test("should return 400 if user is not registered", async () => {
        const res = await request(app).post("/auth/register").send({ username: "newuser", password: "newpassword" })

        expect(res.statusCode).toBe(400)

        await User.deleteMany({ username: "newuser" })
    })
})

describe("user logout", () => {
    test("should return status code 204", async () => {
        const testUser = { username: "Testing Account 19", password: "Abcd123!" }
        const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: "1h" })
        const res = await request(app).delete("/auth/logout").set("Authorization", `Bearer ${token}`)
        expect(res.statusCode).toBe(204)
    })
})
