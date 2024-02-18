import express from 'express'
import dotenv from 'dotenv'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello, World!')
})