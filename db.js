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

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true}, // Name of the event is required and must be a string
    description: {type: String, required: true}, // Description of the event is required and must be a string
    date: {type: Date, required: true}, // Date of the event is required and must be a date
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true} // Category of the event is required and must be a reference to the Category model
})

// Event model
const Event = mongoose.model('Event', eventSchema)

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
    name: {type: String, required: true}, // Name of the category (e.g. Convention, Movie Screening, etc.) is required and must be a string
})

// Category model
const Category = mongoose.model('Category', categorySchema)

// Export the functions and models
export { closeConnection, Category, Event }