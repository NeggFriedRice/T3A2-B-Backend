import { Router } from "express"
import { User } from '../db.js'

const router = Router()

class UserClass {
    constructor(user) {
        this._id = user._id
        this.username = user.username
        this.isOrganiser = user.isOrganiser
        this.picture = user.picture
        this.description = user.description
        this.animes = user.animes
        this.characters = user.characters
        this.actors = user.actors
        this.isAdmin = user.isAdmin
        this.date_created = user.date_created
    }
}

// Search by username, isOrganiser, isAdmin
router.get('/', async (req, res) => {
    const { username, isOrganiser, isAdmin } = req.query
    let query = {}
    
    if (username) {
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
        const formattedUsers = users.map((u) => new UserClass(u))
        res.send({ user: formattedUsers })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'Error fetching users' })
    }
})

// Get all users
router.get('/all', async (req, res) => {
    const users = await User.find()
    const formattedUsers = users.map((u) => new UserClass(u))
    res.send({ user: formattedUsers })
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