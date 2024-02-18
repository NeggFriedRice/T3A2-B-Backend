import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()


// Connects to MongoDB
try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState === 1 ? 'Connected to MongoDB' : 'Failed to connect to MongoDB') // 1 means connected to MongoDB
} catch (error) {
    console.log(error)
}

// Closes the connection to MongoDB
const closeConnection = () => {
    console.log('Closing connection to MongoDB')
    mongoose.connection.close()
}

// Schema and model definitions

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
    name: {type: String, required: true}, // Name of the category (e.g. Convention, Movie Screening, etc.) is required and must be a string
})

// Category model
const Category = mongoose.model('Category', categorySchema)

// Export the functions and models
export { closeConnection, Category }