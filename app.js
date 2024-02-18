import express from 'express'
import dotenv from 'dotenv'

const app = express() // Creates an Express application

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

/* Event Routes */

// List of all events
app.get('/events', (req, res) => {
    // TODO: Create Functionality
    res.send('List of events')
})

// Get a single event
app.get('/events/:id', (req, res) => {
    // TODO: Create Functionality
    res.send('Get an event')
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
app.delete('/events/:id', (req, res) => {
    // TODO: Create Functionality
    res.send('Delete an event')
})

export default app