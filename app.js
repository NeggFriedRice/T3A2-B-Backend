import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Event } from './db.js'

const app = express() // Creates an Express application

app.use(cors()) // Enables Cross-Origin Resource Sharing (CORS)

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

/* Event Routes */

// List of all events
app.get('/events', async (req, res) => {
    // TODO: Create Functionality
    res.send( await Event.find() )
})

// Get a single event
app.get('/events/:id', async (req, res) => {
    // TODO: Create Functionality
    req.params.id
    res.send( await Event.findById(req.params.id))
})

// Create an event
app.post('/events', (req, res) => {
    // TODO: Create Functionality
    res.send('Create an event')
})

// Update an event
app.put('/events/:id', (req, res) => {
    // TODO: Create Functionality
    res.send('Update an event')
})

// Delete an event
app.delete('/events/:id', async (req, res) => {
    // TODO: Create Functionality
    req.params.id
    await Event.findByIdAndDelete(req.params.id)
    res.send('Deleted an event')
})

// TESTING - Get all categories
app.get('/categories', async (req, res) => res.send(await Category.find()))

export default app