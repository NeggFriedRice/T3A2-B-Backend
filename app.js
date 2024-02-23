import express from 'express'
import cors from 'cors'
import { Category } from './db.js'
import eventsRouter from './routes/events_routes.js'
import userRouter from './routes/user_routes.js'
import authRouter, { authenticateAdmin, authenticateToken } from './routes/auth.js'
// import imagesRouter from './routes/images_route.js'

const app = express() // Create an Express application

/* Middleware */
app.use(cors()) // Enable All CORS Requests

app.use(express.json()) // Parse JSON bodies

/* API Routes */
app.get('/', (req, res) => {
    res.send('Welcome to the API!')
})
app.use('/events', eventsRouter)

app.use('/users', /* authenticateAdmin, */ userRouter)

app.use('/auth', authRouter)

// app.use('/images', imagesRouter)

app.get('/categories', async (req, res) => res.send(await Category.find()))

/* Exports */
export default app