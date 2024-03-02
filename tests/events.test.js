import request from 'supertest'
import app from '../app.js'
import { Event } from '../db.js'

describe('should get all events that match a criteria', () => {
    test('should return 200 OK', async () => {
        const res = await request(app)
            .get('/events?month=1&year=2022')
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
    })
})

describe('should get all events', () => {
    test('should return 200 OK', async () => {
        const res = await request(app)
            .get('/events/all')
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
    })
})

describe('should get a single event', () => {
    test('should return 200 OK', async () => {
        const res = await request(app)
            .get('/events/61d9f3a7e2e4e4d1b0f3b5c7')
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
    })
})

describe('should create an event', () => {
    let token
    let eventId

    beforeAll(async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'administrator', password: 'admin' })
        
        token = res.body.accessToken
    })

    afterAll(async () => {
        await request(app)
            .delete('/auth/logout')
    })

    test('should return 200 OK', async () => {
        const res = await request(app)
            .post('/events')
            .set('Authorization', `Bearer ${token}`) // Add the authentication token here
            .send({
                title: "New Event",
                description: "Description",
                category: "65d3122a18f0ff0610d9a8c3",
                date: "2025-01-01",
                anime: "Anime",
                organiser: "Organiser",
            })
        
        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()

        // Clean up the database
        await request(app)
            .delete(`/events/${res.body._id}`)
    })

    test('should return 400 Bad Request', async () => {
        const res = await request(app)
            .post('/events')
            .set('Authorization', `Bearer ${token}`) // Add the authentication token here
            .send({
                title: "New Event",
                description: "Description",
                category: "65d3122a18f0ff0610d9a8c3",
                date: "2025-01-01",
                anime: "Anime",
                price: "Price",
            })
        
        expect(res.statusCode).toBe(400)
        expect(res.body).toBeDefined()
    })
})

// RSVP to an event
describe('should RSVP to an event', () => {
    let token

    beforeAll(async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'administrator', password: 'admin' })
        
        token = res.body.accessToken
    })

    afterAll(async () => {
        await request(app)
            .delete('/auth/logout')
    })

    test('should return 200 OK', async () => {
        const res = await request(app)
            .post(`/events/65e30efa7dbcca002365c6a8/rsvp-add`)
            .set('Authorization', `Bearer ${token}`) // Add the authentication token here
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()

        // Clean up the database
        await request(app)
            .post(`/events/65e30efa7dbcca002365c6a8/rsvp-remove`)
            .set('Authorization', `Bearer ${token}`) // Add the authentication token here
    })

    test('should return 400 Bad Request', async () => {
        const res = await request(app)
            .post('/events/invalid/rsvp-add')
            .set('Authorization', `Bearer ${token}`) // Add the authentication token here
        
        expect(res.statusCode).toBe(400)
        expect(res.body).toBeDefined()
    })

    test('should return 400 Bad Request', async () => {
        const res = await request(app)
            .post('/events/61d9f3a7e2e4e4d1b0f3b5c7/rsvp-add')
        
        expect(res.statusCode).toBe(401)
        expect(res.body).toBeDefined()
    })
})