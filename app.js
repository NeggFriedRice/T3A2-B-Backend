import express from 'express'
import dotenv from 'dotenv'
import { Category, Event } from './db.js'

const app = express() // Creates an Express application

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

/* Event Routes */

// List of all events
app.get('/events', async (req, res) => {
    // TODO: Create Functionality
    res.send(await Event.find())
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

// TESTING - Get all categories
app.get('/categories', async (req, res) => res.send(await Category.find()))

export default app