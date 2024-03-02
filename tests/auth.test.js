import request from "supertest"
import jwt from "jsonwebtoken"
import app from "../app.js"

describe("verifyAndAttachUser", () => {
    let token

    beforeEach(() => {
        // Mock user and sign a token
        const user = { id: 1, name: "Test User" }
        token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" })
    })

    test('should return 200 if token is valid', async () => {
        const res = await request(app)
            .get("/auth/protected-route")
            .set("Authorization", `Bearer ${token}`)

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
})
