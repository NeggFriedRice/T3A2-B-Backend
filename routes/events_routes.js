import { Router } from "express"
import { Event, User } from '../db.js'
import { authenticateAdminOrOrganiser, authenticateToken } from './auth.js'

const router = Router() // Create a new router

// Search by category, title, date, user
router.get('/', async (req, res) => {
    const { category, title, month, year, userId } = req.query

    // Determine the search criteria
    if (category) {
        res.send(await Event.find({ category: category }))
    } else if (title) {
        const regex = new RegExp(title, 'i')
        res.send(await Event.find({ title: regex }))
    } else if (month || year) {
        const conditions = []
        if (month) {
            // $eq is a MongoDB aggregation operator that compares two values and returns true if they are equivalent
            conditions.push({ $eq: [{ $month: "$date" }, month] })
        }
        if (year) {
            // $eq is a MongoDB aggregation operator that compares two values and returns true if they are equivalent
            conditions.push({ $eq: [{ $year: "$date" }, year] })
        }
        if (conditions.length > 0) {
            // $expr is a MongoDB aggregation operator that allows the use of aggregation expressions within the query language
            res.send(await Event.find({
                $expr: {
                    $and: conditions // $and is a MongoDB aggregation operator that returns true if all the conditions are true
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
router.post('/', authenticateAdminOrOrganiser, async (req, res) => {
    const { title, description, category, date, anime, organiser, price, venue, coords } = req.body
    const parsedDate = Date.parse(date) // Convert the date from a string to a Date object
    const userId = req.user._id

    try {   
        const insertedEvent = new Event({
            title: title,
            description: description,
            category: category,
            date: parsedDate,
            venue: venue,
            coords: coords,
            anime: anime,
            createdBy: userId,
            organiser: organiser,
            price: price
        })
        console.log("New Event:", insertedEvent)

        await insertedEvent.save()
        console.log("Event saved:", insertedEvent)
        res.status(201).send(insertedEvent)
    } catch (error) {
        console.error("Error creating:", error)
        res.status(400).send({ error: error.message})
    }
})

// Update an event
router.put('/:id', authenticateAdminOrOrganiser, async (req, res) => {
    const { title, description, category, date, anime, organiser, price, venue, coords } = req.body
    try {
        const updateEvent = await Event.findByIdAndUpdate(req.params.id, {
            title: title,
            description: description,
            category: category,
            date: date,
            venue: venue,
            coords: coords,
            anime: anime,
            organiser: organiser,
            price: price,
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

// RSVP to an event
router.post('/:id/rsvp-add', authenticateToken, async (req, res) => {
    const eventId = req.params.id
    const userId = req.user._id
    try {
        const event = await Event.findById(eventId)
        const user = await User.findById(userId)
        // Check if the user has already RSVPed
        if (event && user) {
            if (event.rsvp.includes(userId) && user.rsvp.includes(eventId)) {
                res.status(400).send({ error: 'User has already RSVPed' })
            } else {
                // Add the user to the RSVP list
                event.rsvp.push(userId)
                await event.save()
                // Add the event to the user's RSVP list
                user.rsvp.push(eventId)
                await user.save()
                res.send({ message: 'RSVP added'})
            }
        } else {
            res.status(404).send({ error: 'Entry does not exist' })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }  
})

// Remove RSVP from an event
router.post('/:id/rsvp-remove', authenticateToken, async (req, res) => {
    const eventId = req.params.id
    const userId = req.user._id
    try {
<<<<<<< Updated upstream
        const event = await Event.findById(eventId)
        // Check if the user has already RSVPed
        if (event) {
            // Remove the user from the RSVP list
            if (event.rsvp.includes(userId)) {
                event.rsvp = event.rsvp.filter(id => !id.equals(userId));
                await event.save()
                res.send({ message: 'RSVP removed' })
            } else {
                res.status(400).send({ error: 'User has not RSVPed' })
            }
=======
        const event = await Event.findByIdAndUpdate(eventId, {
            $pull: { rsvp: userId }
        })
        const user = await User.findByIdAndUpdate(userId, {
            $pull: { rsvp: eventId }
        })
        if (event && user) {
            res.send({ message: 'RSVP removed' })
>>>>>>> Stashed changes
        } else {
            res.status(404).send({ error: 'Entry does not exist' })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// Get RSVP count for an event
router.get('/:id/rsvp-count', async (req, res) => {
    const eventId = req.params.id
    try {
        const event = await Event.findById(eventId)
        if (event) {
            res.send({ count: event.rsvp.length }) // Return the number of RSVPs as a Number
        } else {
            res.status(404).send({ error: 'Entry does not exist' })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

/* Exports */
export default router