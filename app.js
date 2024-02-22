import express from 'express'
import cors from 'cors'
import { Category } from './db.js'
import eventsRouter from './routes/events_routes.js'
import userRouter from './routes/user_routes.js'
import authRouter, { authenticateAdmin, authenticateToken } from './routes/auth.js'

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

// Mounts the user router
app.use('/users', authenticateAdmin, userRouter)

// Mounts the auth router
app.use('/auth', authRouter)

// TESTING - Get all categories
app.get('/categories', async (req, res) => res.send(await Category.find()))

export default app