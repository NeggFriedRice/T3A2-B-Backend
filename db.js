import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState === 1 ? 'Connected to MongoDB' : 'Failed to connect to MongoDB')
} catch (error) {
    console.log(error)
}

const closeConnection = () => {
    console.log('Closing connection to MongoDB')
    mongoose.connection.close()
}

// Schema and model definitions
const categorySchema = new mongoose.Schema({
    name: {type: String, required: true},
})

const Category = mongoose.model('Category', categorySchema)

export { closeConnection, Category }