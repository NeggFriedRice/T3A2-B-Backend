import { Router } from "express"
import { authenticateToken } from "./auth.js"
import multer from "multer"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"
import { User } from "../db.js"

dotenv.config()

const upload = multer({ dest: 'uploads/' }) // Create a new multer instance

const router = Router() // Create a new router

const s3 = new S3Client({ // Create a new S3 client
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

async function uploadToS3(file, userId) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    }
    const command = new PutObjectCommand(params)
    // store the key in the user's picture field
    const user = User.findById(userId) 
    user.picture = file.originalname
    user.save()

    return await s3.send(command)
}

async function fetchFromS3(userId) {
    const user = User.findById(userId)
    const key = user.picture

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    }

    const command = new GetObjectCommand(params)

    return await s3.send(command)
}

router.post('/pfp', authenticateToken, upload.single('image'), async (req, res) => {
    const userId = req.user._id
    const file = req.file

    const result = await uploadToS3(file, userId)

    res.send(result)
})

router.get('/pfp', authenticateToken, async (req, res) => {
    const userId = req.user._id
    const file = await fetchFromS3(userId)

    file.pipe(res)
})


export default router