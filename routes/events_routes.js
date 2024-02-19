import { Router } from "express"
import { Event } from '../db.js'

const router = Router()

// List of all events
router.get('/', async (req, res) => {
    res.send(await Event.find())
})

// Get a single event
router.get('/:id', async (req, res) => {
    try {
        res.send( await Event.findById(req.params.id))
    } catch (error) {
        res.status(404).send({ error: 'Entry does not exist' })
    }
})

// Create an event

/*
title: string, required
description: string, required
date: date, required
TODO: Add a field for location
category: reference to Category, required
TODO: Add a field for the image URL
TODO: Add a field for anime
TODO: Add a field for organiser
TODO: Add a field for entry price
TODO: Add a field for rsvp
*/

router.post('/', async (req, res) => {
    const { title, description, category } = req.body

    try {   
        const insertedEvent = new Event({
            title,
            description,
            date: new Date(),
            category 
        })
        await insertedEvent.save()

        res.status(201).send(insertedEvent)
    } catch (error) {
        res.status(400).send({ error: error.message})
    }
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