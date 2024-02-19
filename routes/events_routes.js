import { Router } from "express"
import { Event } from '../db.js'

const router = Router()

// List of all events
router.get('/', async (req, res) => {
    res.send(await Event.find())
})

// Get a single event
router.get('/:id', async (req, res) => {
    // TODO: Create Functionality
    try {
        res.send( await Event.findById(req.params.id))
    } catch (error) {
        res.status(404).send({ error: 'Entry does not exist' })
    }
})

// Create an event
router.post('/', (req, res) => {
    // TODO: Create Functionality
    res.send('Create an event')
})

// Update an event
router.put('/:id', (req, res) => {
    // TODO: Create Functionality
    res.send('Update an event')
})

// Delete an event
router.delete('/:id', async (req, res) => {
    // TODO: Create Functionality
    req.params.id
    await Event.findByIdAndDelete(req.params.id)
    res.send('Deleted an event')
})

export default router