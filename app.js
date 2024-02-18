import express from 'express'
import dotenv from 'dotenv'

const app = express() // Creates an Express application

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

export default app