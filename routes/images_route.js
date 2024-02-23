import { Router } from "express"
import { authenticateToken } from "./auth.js"
import multer from "multer"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"
import { User } from "../db.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = Router() // Create a new router

const s3 = new S3Client({ // Create a new S3 client
    region: process.env.PFP_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})

async function uploadToS3(file, userId) {
    const params = {
        Bucket: process.env.PFP_BUCKET,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    try {
        const command = new PutObjectCommand(params)
        // store the key in the user's picture field
        const user = await User.findById(userId) 
        user.picture = file.originalname
        const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: process.env.PFP_BUCKET, Key: file.originalname }))
        user.pictureUrl = url
        await user.save()
    
        return await s3.send(command)
    } catch (error) {
        console.error(error)
    }
}

router.post('/pfp', authenticateToken, upload.single('image'), async (req, res) => {
    const userId = req.user._id
    const file = req.file

    console.log(file)

    const result = await uploadToS3(file, userId)

    res.send(result)
})

export default router