/* import { Router } from "express"
import { authenticateToken } from "./auth.js"
import multer from "multer"
import s3 from "aws-sdk/clients-s3"
import dotenv from "dotenv"
import { User } from "../db"

dotenv.config()

const upload = multer({ dest: 'uploads/' }) // Create a new multer instance

const router = Router() // Create a new router

const s3Client = new s3({ // Create a new S3 client
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

function uploadToS3(file, userId) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    }

    // store the key in the user's picture field
    const user = User.findById(userId) 
    user.picture = file.originalname
    user.save()

    return s3Client.upload(params).promise()
}

function fetchFromS3(userId) {
    const user = User.findById(userId)
    const key = user.picture

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    }

    return s3Client.getObject(params).createReadStream()
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


export default router */