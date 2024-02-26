import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { marked } from 'marked'
import path from 'path'
import { Category } from './db.js'
import eventsRouter from './routes/events_routes.js'
import userRouter from './routes/user_routes.js'
import authRouter, { authenticateAdmin, authenticateToken } from './routes/auth.js'
import imagesRouter from './routes/images_route.js'

const app = express() // Create an Express application

/* Middleware */
app.use(cors()) // Enable All CORS Requests

app.use(express.json()) // Parse JSON bodies

/* API Routes */
app.get('/', (req, res) => {
    fs.readFile(path.join(process.cwd(), 'README.md'), 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'An error occurred' })
        } else {
            const htmlContent = marked(data)
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>README</title>
                <style>
                    /* Add your CSS styling here */
                    body {
                        font-family: Arial, sans-serif;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    code {
                        background-color: #f9f9f9;
                        padding: 2px 4px;
                        border-radius: 3px;
                        font-family: monospace;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `
            res.send(html)
        }
    })
})
app.use('/events', eventsRouter)

app.use('/users', authenticateAdmin, userRouter)

app.use('/auth', authRouter)

app.use('/images', imagesRouter)

app.get('/categories', async (req, res) => res.send(await Category.find()))

/* Exports */
export default app