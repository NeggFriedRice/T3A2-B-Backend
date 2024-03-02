import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { RefreshToken, User, Event } from '../db.js'
import UserClass from '../data_structures.js'

const router = Router() // Create a new router

// Generate an JWT access token
function generateAccessToken(user) {
    return jwt.sign({ _id: user._id, username: user.username, isAdmin: user.isAdmin, isOrganiser: user.isOrganiser}, process.env.JWT_SECRET, { expiresIn: '1d' })
}

// Check if the refresh token is valid and return a new access token
router.post('/token', (req, res) => {
    const refreshTokenParam = req.body.refreshToken
    if (refreshTokenParam == null) return res.sendStatus(401)
    if (!RefreshToken.findOne({ token: refreshTokenParam })) return res.sendStatus(403)
    jwt.verify(refreshTokenParam, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user })
        res.status(200).json({ accessToken: accessToken })
    })
})

// Middleware to authenticate the user using the access token
function authenticateToken(req, res, next) {
    verifyAndAttachUser(req, res, next, () => true) // Always valid
}

// Checks if the user is an admin and verifies the access token
function authenticateAdmin(req, res, next) {
    verifyAndAttachUser(req, res, next, user => user.isAdmin)
}

// Checks if the user is an organiser and verifies the access token
async function authenticateOrganiser(req, res, next) {
    const eventId = await Event.findById(req.params.id)
    verifyAndAttachUser(req, res, next, user => user.isOrganiser && eventId.createdBy.toString() === user._id)
}

// Checks if the user is an admin or organiser and verifies the access token
async function authenticateAdminOrOrganiser(req, res, next) {
    const eventId = await Event.findById(req.params.id)
    verifyAndAttachUser(req, res, next, user => {
        if (user.isAdmin) {
            return true
        }
        if (user.isOrganiser) {
            // Check if the event was created by the organiser
            if (eventId) {
                return eventId.createdBy.toString() === user._id
            }
            return true
        }
        return false
    })
}

// Verify the access token and attach the user to the request
function verifyAndAttachUser(req, res, next, validationFn) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send({ error: 'No token' }) // no token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ error: 'Token expired' })
            } else {
                return res.sendStatus(403) // invalid token
            }
        }
        if (!validationFn(user)) {
            return res.status(403).send({ error: 'Insufficient permissions' })
        }
        req.user = user
        next()
    })
}

// Decodes the access token and returns if token is expired
router.post('/decode', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send({ error: 'No token' }) // no token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ error: 'Token expired' })
            } else  {
                return res.sendStatus(403) // invalid token
            }
        }
        res.status(200).send({ expired: false })
    })
})

router.delete('/logout', (req, res) => {
    const refreshToken = req.body.token
    RefreshToken.deleteOne({ token: refreshToken })
    res.sendStatus(204)
})

// Signup
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const saltRounds = 10 // Number of salt rounds for hashing the password

    try {
        const salt = await bcrypt.genSalt(saltRounds) // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt) // Hash the password
        const user = new User({ username, password: hashedPassword, salt }) // Create a new user
        await user.save() // Save the user
        res.send({ message: 'User created successfully' })
    } catch (error) {
        console.error(error)
        res.status(400).send({ error: 'User creation failed' })
    }
})


// Sign in
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    if (user) {
        const match = await bcrypt.compare(password, user.password) // Compare the password with the hash
        if (match) {
            const userName = { name: user }
            const accessToken = generateAccessToken(user) // Generate an access token
            const refreshToken = jwt.sign(userName, process.env.REFRESH_SECRET) // Generate a refresh token

            // Save the refresh token in the database
            const refreshTokenModel = new RefreshToken({ token: refreshToken })
            await refreshTokenModel.save()
            const formattedUser = new UserClass(user) // Map the user to the UserClass structure
            res.send({ 
                message: 'Sign in successful',
                user: formattedUser,
                accessToken: accessToken,
                userId: user._id,
                refreshToken: refreshToken
            })
        } else {
            res.status(400).send({ error: 'Invalid username or password' })
        }
    } else {
        res.status(400).send({ error: 'Invalid username or password' })
    }
})

// To test the authentication middleware
router.get('/protected-route', authenticateToken, (req, res) => {
    res.send({ message: 'Access granted' })
})

// To test the admin authentication middleware
router.get('/admin-protected-route', authenticateAdmin, (req, res) => {
    res.send({ message: 'Access granted' })
})

/* Exports */
export default router
export { authenticateToken, authenticateAdmin, authenticateOrganiser, authenticateAdminOrOrganiser }