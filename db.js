import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// Connects to MongoDB
try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState === 1 ? "Connected to MongoDB" : "Failed to connect to MongoDB") // 1 means connected to MongoDB
} catch (error) {
    console.log(error)
}

// Closes the connection to MongoDB
const closeConnection = () => {
    console.log("Closing connection to MongoDB")
    mongoose.connection.close()
}

// Schema and model definitions

// Define the schema for the User model

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Username is required and must be unique
    password: { type: String, required: true }, // Password is required and must be a string
    salt: { type: String, required: true }, // Salt is required and must be a string
    isOrganiser: { type: Boolean, default: false }, // isOrganiser is a boolean and defaults to false
    picture: { type: String }, // Picture is a string
    description: { type: String }, // Description is a string
    animes: [{ type: String }], // Animes is an array of strings
    characters: [{ type: String }], // Characters is an array of strings
    actors: [{ type: String }], // Actors is an array of strings
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events is an array of references to the Event model
    isAdmin: { type: Boolean, default: false }, // isAdmin is a boolean and defaults to false
    date_created: { type: Date, default: Date.now }, // Date the user was created
})

// User model
const User = mongoose.model("User", userSchema)

// Define the schema for the Event model
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Name of the event is required and must be a string
    description: { type: String, required: true }, // Description of the event is required and must be a string
    date: { type: Date, required: true }, // Date of the event is required and must be a date
    // TODO: Add a field for location
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Category of the event is required and must be a reference to the Category model
    // TODO: Add a field for the image URL
    anime: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the event is required and must be a reference to the User model
    organiser: { type: String, required: true }, // Organiser of the event is a reference to the User model
    // TODO: Add a field for entry price
    // TODO: Add a field for rsvp
    date_created: { type: Date, default: Date.now }, // Date the event was created
    date_last_edited: { type: Date }, // Date the event was last edited
})

// Event model
const Event = mongoose.model("Event", eventSchema)

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Name of the category (e.g. Convention, Movie Screening, etc.) is required and must be a string
})

// Category model
const Category = mongoose.model("Category", categorySchema)

// Define the schema for the RefreshToken model
const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true }, // Token is required and must be a string
})

// RefreshToken model
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)

// Export the functions and models
export { closeConnection, Category, Event, User, RefreshToken }
