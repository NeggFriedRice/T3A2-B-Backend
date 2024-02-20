import { Router } from "express"
import { User } from '../db.js'
import bcrypt from 'bcrypt'

const router = Router()

// Signup
router.post('/', async (req, res) => {
    const { username, password } = req.body
    const saltRounds = 10 // Number of salt rounds for hashing the password

    try {
        const salt = await bcrypt.genSalt(saltRounds) // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt) // Hash the password
        const user = new User({ username, password: hashedPassword, salt }) // Create a new user
        await user.save() // Save the user
        res.send({ message: 'User created successfully' })
    } catch (error) {
        res.status(400).send({ error: 'User creation failed' })
    }
})

export default router