import { Router } from "express"
import { User } from '../db.js'

const router = Router()

// Search by username, isOrganiser, isAdmin
router.get('/', async (req, res) => {
    const { username, isOrganiser, isAdmin } = req.body

    switch (username, isOrganiser, isAdmin, date) {
        case username:
            res.send(await User.find({ username: username }))
            break
        case isOrganiser:
            res.send(await User.find({ isOrganiser: isOrganiser }))
            break
        case isAdmin:
            res.send(await User.find({ isAdmin: isAdmin }))
            break
        default:
            break
    }
})

// Get all users
router.get('/all', async (req, res) => {
    res.send(await User.find())
})

// Get a single user by id
router.get('/:id', async (req, res) => {
    try {
        res.send(await User.findById(req.params.id))
    } catch (error) {
        res.status(404).send({ error: 'User does not exist' })
    }
})

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        res.send(await User.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(404).send({ error: 'User does not exist' })
    }
})

export default router