import express from 'express'
import cors from 'cors'
import { Category } from './db.js'
import eventsRouter from './routes/events_routes.js'
import userRouter from './routes/user_routes.js'
import signupRouter from './routes/signup_route.js'
import signinRouter from './routes/signin_route.js'

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
app.use('/users', userRouter)

// Mounts the signup router
app.use('/signup', signupRouter)

// Mounts the signin router
app.use('/signin', signinRouter)

// TESTING - Get all categories
app.get('/categories', async (req, res) => res.send(await Category.find()))

export default app