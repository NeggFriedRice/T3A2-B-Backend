import { Router } from "express"
import { Event } from '../db.js'
import { authenticateAdmin, authenticateAdminOrOrganiser, authenticateOrganiser, authenticateToken } from './auth.js'

const router = Router()

// Search by category, title, date
router.get('/', async (req, res) => {
    const { category, title, month, year } = req.query

    if (category) {
        res.send(await Event.find({ category: category }))
    } else if (title) {
        const regex = new RegExp(title, 'i')
        res.send(await Event.find({ title: regex }))
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
        res.send(await Event.findById(req.params.id))
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

router.post('/', authenticateAdminOrOrganiser, async (req, res) => {
    const { title, description, category, date, anime, organiser } = req.body
    const parsedDate = Date.parse(date)
    const userId = req.user._id

    try {   
        const insertedEvent = new Event({
            title: title,
            description: description,
            category: category,
            date: parsedDate,
            anime: anime,
            createdBy: userId,
            organiser: organiser
        })
        await insertedEvent.save()
        res.status(201).send(insertedEvent)
    } catch (error) {
        res.status(400).send({ error: error.message})
    }
})

// Update an event
router.put('/:id', authenticateAdminOrOrganiser, async (req, res) => {
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
        if (!res.headersSent) {
            res.status(400).send({ error: error.message })
        }
    }
})

// Delete an event
router.delete('/:id', authenticateAdminOrOrganiser, async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id)
    if (deletedEvent) {
        res.send('Entry deleted')
    } else {
        res.status(404).send({ error: 'Entry does not exist' })
    }
})

export default router