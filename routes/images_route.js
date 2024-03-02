import { Router } from "express"
import { authenticateToken } from "./auth.js"
import multer from "multer"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"
import { User, Event } from "../db.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import sharp from "sharp"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = Router() // Create a new router

const s3 = new S3Client({
    // Create a new S3 client
    region: process.env.PFP_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
})

async function uploadToS3(file, userId, eventId) {
    if (!file) {
        return { error: "No file" }
    }

    let buffer
    if (userId) {
        buffer = await sharp(file.buffer).resize({ height: 200, width: 200, fit: "cover" }).toBuffer()
    } else if (eventId) {
        buffer = await sharp(file.buffer).resize({ height: 300, width: 200, fit: "cover" }).toBuffer()
    } else {
        return { error: "Invalid request" }
    }

    const params = {
        Bucket: process.env.PFP_BUCKET,
        Key: file.originalname,
        Body: buffer,
        ContentType: file.mimetype,
    }
    try {
        const command = new PutObjectCommand(params)
        // store the key in the user's picture field
        if (userId) {
            const user = await User.findById(userId)
            if (user.picture) {
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.PFP_BUCKET, Key: user.picture }))
            }
            user.picture = file.originalname
            const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: process.env.PFP_BUCKET, Key: file.originalname }), { expiresIn: 604800 })
            user.pictureUrl = url
            await user.save()
        }
        if (eventId) {
            // store the key in the event's picture field
            const event = await Event.findById(eventId)
            if (event.picture) {
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.PFP_BUCKET, Key: event.picture }))
            }
            event.picture = file.originalname
            const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: process.env.PFP_BUCKET, Key: file.originalname }), { expiresIn: 604800 })
            event.pictureUrl = url
            await event.save()
        }
        return await s3.send(command)
    } catch (error) {
        console.error(error)
        return error
    }
}

router.post("/pfp", authenticateToken, upload.single("image"), async (req, res) => {
    const userId = req.user._id
    const file = req.file

    console.log(file)

    const result = await uploadToS3(file, userId)

    res.send(result)
})

router.post("/event/:id", authenticateToken, upload.single("image"), async (req, res) => {
    const file = req.file
    const eventId = req.params.id

    console.log(file)

    const result = await uploadToS3(file, null, eventId)

    res.send(result)
})

export default router
