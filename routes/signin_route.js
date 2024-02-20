import { Router } from "express"
import { User } from '../db.js'
import bcrypt from 'bcrypt'

const router = Router()

// Sign in
router.post('/', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            res.send({ message: 'Sign in successful' })
        } else {
            res.status(400).send({ error: 'Invalid username or password' })
        }
    } else {
        res.status(400).send({ error: 'Invalid username or password' })
    }
})

export default router