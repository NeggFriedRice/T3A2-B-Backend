import { Router } from "express"
import { User } from '../db.js'
import UserClass from '../data_structures.js'
import { authenticateToken, authenticateAdminOrOrganiser, authenticateAdmin } from './auth.js'

const router = Router()

// Search by username, isOrganiser, isAdmin
router.get('/', authenticateToken, async (req, res) => {
    const { username, isOrganiser, isAdmin } = req.query
    let query = {}
    
    if (username) {
        // Create a case-insensitive regex for the username to allow partial matches
        const regex = new RegExp(username, 'i')
        query = { username: regex }
    } else if (isOrganiser) {
        query = { isOrganiser: isOrganiser }
    } else if (isAdmin) {
        query = { isAdmin: isAdmin }
    } else {
        return res.status(404).send({ error: 'User does not exist' })
    }

    try {
        const users = await User.find(query)
        const formattedUsers = users.map((u) => new UserClass(u)) // Map the users to the UserClass structure
        res.send({ user: formattedUsers })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'Error fetching users' })
    }
})

// Get all users
router.get('/all', authenticateAdmin, async (req, res) => {
    const users = await User.find()
    const formattedUsers = users.map((u) => new UserClass(u)) // Map the users to the UserClass structure
    res.send({ user: formattedUsers })
})

// Get a single user by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const formattedUser = new UserClass(user) // Map the user to the UserClass structure
        res.send({ user: formattedUser })
    } catch (error) {
        res.status(404).send({ error: 'User does not exist' })
    }
})

// Delete a user
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        res.send(await User.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(404).send({ error: 'User does not exist' })
    }
})

// Update single user by id
router.put('/toggle/:id', authenticateAdmin, async (req, res) => {
    const { isOrganiser } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            isOrganiser: isOrganiser,
        }, { new: true })
        if (updateUser) {
            res.send(updateUser)
        } else {
            res.status(404).send({ error: "User does not exist" })
        }
    } catch (error) {
        res.status(400).send({ error: error.message})
    }
})

// Update favorite characters for a user by id
router.put('/:id/characters', authenticateToken, async (req, res) => {
    const { characters } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { characters }, { new: true })
        if (updateUser) {
            res.send(updateUser)
        } else {
            res.status(404).send({ error: "User does not exist" })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

/* Exports */
export default router