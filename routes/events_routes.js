import { Router } from "express"
import { Event } from '../db.js'

const router = Router()

// Search by category, title, date
router.get('/', async (req, res) => {
    const { category, title, month, year } = req.body

    if (category) {
        res.send(await Event.find({ category: category }))
    } else if (title) {
        res.send(await Event.find({ title: title }))
    } else if (month || year) {
        const conditions = []
        if (month) {
            conditions.push({ $eq: [{ $month: "$date" }, month] })
        }
        if (year) {
            conditions.push({ $eq: [{ $year: "$date" }, year] })
        }
        if (conditions.length > 0) {
            res.send(await Event.find({
                $expr: {
                    $and: conditions
                }
            }))
        }
    }
})

// List all events
router.get('/all', async (req, res) => {
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
category: reference to Category, required
date: YYYY-MM-DD, required
anime: string, optional
*/

router.post('/', async (req, res) => {
    const { title, description, category, date, anime } = req.body

    const parsedDate = Date.parse(date)

    try {   
        const insertedEvent = new Event({
            title,
            description,
            category,
            date: parsedDate,
            anime
        })
        await insertedEvent.save()

        res.status(201).send(insertedEvent)
    } catch (error) {
        res.status(400).send({ error: error.message})
    }
})

// Update an event
router.put('/:id', async (req, res) => {
    const { title, description, category } = req.body
    try {
        const updateEvent = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            date_last_edited: Date.now()
        }, { new: true })
        if (updateEvent) {
            res.send(updateEvent)
        } else {
            res.status(404).send({ error: 'Entry does not exist' })
        }
    } catch (error) {
        res.status(500).send({ error: error.message})
    }
})

// Delete an event
router.delete('/:id', async (req, res) => {
    // TODO: Create Functionality
    req.params.id
    await Event.findByIdAndDelete(req.params.id)
    res.send('Deleted an event')
})

export default router