import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Event, Category } from './db.js'
import eventsRouter from './routes/events_routes.js'

// Creates an Express application
const app = express()

// Enables Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Enables parsing of JSON body data
app.use(express.json())

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

// Mounts the events router
app.use('/events', eventsRouter)

// TESTING - Get all categories
app.get('/categories', async (req, res) => res.send(await Category.find()))

export default app