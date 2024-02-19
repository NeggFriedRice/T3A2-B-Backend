import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Event, Category } from './db.js'
import eventsRouter from './routes/events_routes.js'

const app = express() // Creates an Express application

app.use(cors()) // Enables Cross-Origin Resource Sharing (CORS)

app.use(express.json()) // Enables parsing of JSON body data

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.use('/events', eventsRouter) // Mounts the events router

// TESTING - Get all categories
app.get('/categories', async (req, res) => res.send(await Category.find()))

export default app