import bcrypt from "bcrypt"
import { closeConnection, Category, Event, User } from "./db.js"

const users = [
    { username: "administrator", password: "admin", isAdmin: true },
    { username: "organiser", password: "organiser", isOrganiser: true },
    { username: "user", password: "user" },
]

// Hash the passwords
const saltRounds = 10 // Number of salt rounds for hashing the password
// Loop through the users and hash the passwords and add the salt
for (let user of users) {
    const salt = await bcrypt.genSalt(saltRounds) // Generate a salt
    user.password = await bcrypt.hash(user.password, salt) // Hash the password
    user.salt = salt
}

await User.deleteMany()
console.log("Deleted users")
await User.insertMany(users)
console.log("Added users")

const categories = [{ name: "Convention" }, { name: "Movie Screening" }, { name: "Episode Screening" }, { name: "Multi-Episode Screening" }, { name: "Special Event" }]

await Category.deleteMany()
console.log("Deleted all categories")
await Category.insertMany(categories)
console.log("Inserted categories")

const categoriesFetch = await Category.find()
const usersFetch = await User.find()

const events = [
    {
        title: "Anime Odyssey Expo",
        description: "Embark on a journey through the world of anime with screenings, cosplay contests, and special guest panels. ",
        date: new Date("2024-03-20"),
        venue: "Sydney Convention and Exhibition Centre",
        coords: { lat: 0, lng: 0 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Other",
        organiser: "Odyssey Events",
		createdBy: (await usersFetch[1])._id,
        price: 0,
    },
    {
        title: "Mecha Mayhem Madness",
        description: "Prepare for a robotic rampage with live mecha battles, model kit workshops, and exclusive merchandise.",
        date: new Date("2024-03-28"), // Set a specific date for the event
        venue: "Melbourne Showgrounds",
        coords: { lat: -37.7963, lng: 144.9612 }, // Melbourne Showgrounds coords
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Other",
        createdBy: (await usersFetch[1])._id,
        organiser: "Mad Mecha Events",
        price: 0,
    },
    {
        title: "Sailor Senshi Soiree",
        description: "Join forces with fellow Sailor Moon fans for a magical evening of cosplay, karaoke, and themed cocktails.",
        date: new Date("2024-04-10"),
        venue: "",
        coords: { lat: -33.8484, lng: 151.2101 },
        category: (await categoriesFetch[4])._id,
        picture: "",
        pictureUrl: "",
        anime: "Sailor Moon",
        createdBy: (await usersFetch[1])._id,
        organiser: "Saturn Senshi Events",
        price: 0,
    },
    {
        title: "Shonen Showdown Festival",
        description: "Experience the adrenaline rush of epic battles and heroic adventures with screenings, gaming tournaments, and artist alley.",
        date: new Date("2024-04-25"),
        venue: "Brisbane Convention and Exhibition Centre",
        coords: { lat: -27.4729, lng: 153.0243 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Other",
        createdBy: (await usersFetch[1])._id,
        organiser: "Shonen Showdown",
        price: 0,
    },
    {
        title: "Magical Girl Masquerade Ball",
        description: "Transform into your favorite magical girl character for a night of enchantment, dancing, and magical performances.",
        date: new Date("2024-05-15"),
        venue: "Adelaide Town Hall",
        coords: { lat: -34.9257, lng: 138.5997 },
        category: (await categoriesFetch[4])._id,
        picture: "",
        pictureUrl: "",
        anime: "Other",
        createdBy: (await usersFetch[1])._id,
        organiser: "Adele's Magical Events",
        price: 0,
    },
    {
        title: "Attack on Titan Titanfest",
        description: "Unleash your inner titan with immersive attractions, scavenger hunts, and themed food stalls inspired by the hit anime series.",
        date: new Date("2024-05-30"),
        venue: "Perth Arena",
        coords: { lat: -31.9476, lng: 115.8572 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Attack on Titan",
        createdBy: (await usersFetch[1])._id,
        organiser: "Crunchyroll",
        price: 0,
    },
    {
        title: "Dragon Ball Z Power-Up Party",
        description: "Gather your energy for a high-energy celebration featuring cosplay duels, trivia challenges, and a Kamehameha contest.",
        date: new Date("2024-06-15"),
        venue: "Gold Coast Convention and Exhibition Centre",
        coords: { lat: -28.0137, lng: 153.431 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Dragon Ball Z",
        createdBy: (await usersFetch[1])._id,
        organiser: "Akira Toriyama Fan Club",
        price: 0,
    },
    {
        title: "Studio Ghibli Gala: Spirited Soiree",
        description: "Step into the enchanting world of Studio Ghibli with film screenings, art exhibitions, and a cosplay parade inspired by beloved classics.",
        date: new Date("2024-07-02"),
        venue: "Canberra Theatre Centre",
        coords: { lat: -35.2817, lng: 149.1291 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Various Ghibli Films",
        createdBy: (await usersFetch[1])._id,
        organiser: "Studio Ghibli Fan Club",
        price: 0,
    },
    {
        title: "One Piece Pirate Plunder",
        description: "Set sail on an adventure-filled day of treasure hunts, pirate duels, and sea shanties inspired by the world of One Piece.",
        date: new Date("2024-07-15"),
        venue: "Darwin Convention Centre",
        coords: { lat: -12.4611, lng: 130.8419 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "One Piece",
        createdBy: (await usersFetch[1])._id,
        organiser: "Darwin Anime Society",
        price: 0,
    },
    {
        title: "Naruto Ninja Night",
        description: "Test your ninja skills with obstacle courses, ramen tastings, and a shadow clone jutsu competition in a night filled with ninja-themed fun.",
        date: new Date("2024-08-01"),
        venue: "Hobart Function and Conference Centre",
        coords: { lat: -42.8812, lng: 147.3257 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Naruto",
        createdBy: (await usersFetch[1])._id,
        organiser: "Shueisha Fan Club",
        price: 0,
    },
    {
        title: "My Hero Academia Heroic Havoc",
        description: "Embrace your quirkiness at this action-packed event featuring hero training challenges, cosplay showcases, and a Plus Ultra dance-off.",
        date: new Date("2024-08-15"),
        venue: "Cairns Convention Centre",
        coords: { lat: -16.9186, lng: 145.7781 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "My Hero Academia",
        createdBy: (await usersFetch[1])._id,
        organiser: "Cairns Anime Alliance",
        price: 0,
    },
    {
        title: "Fullmetal Alchemist Alchemy Alley",
        description: "Explore the mysteries of alchemy through interactive workshops, cosplay parades, and screenings of the iconic anime series.",
        date: new Date("2024-09-26"),
        venue: "Adelaide Convention Centre",
        coords: { lat: -34.9212, lng: 138.5996 },
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Fullmetal Alchemist",
        createdBy: (await usersFetch[1])._id,
        organiser: "Funimation",
        price: 0,
    },
    {
        title: "Neon Genesis Evangelion EVA Expo",
        description: "Dive into the world of Evangelion with immersive exhibits, mecha displays, and a live orchestral performance of iconic soundtrack pieces.",
        date: new Date("2024-10-15"),
        venue: "Perth Convention and Exhibition Centre",
        coords: { lat: -31.9705, lng: 115.8605 }, // Perth Convention and Exhibition Centre coords
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Neon Genesis Evangelion",
        createdBy: (await usersFetch[1])._id,
        organiser: "SBS PopAsia",
        price: 0,
    },
    {
        title: "Tokyo Ghoul Terrorfest",
        description: "Brace yourself for a night of horror with haunted mazes, cosplay contests, and themed attractions inspired by the dark world of Tokyo Ghoul.",
        date: new Date("2024-11-30"),
        venue: "Newcastle Entertainment Centre",
        coords: { lat: -32.927, lng: 151.7791 }, // Newcastle Entertainment Centre coords
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Tokyo Ghoul",
        createdBy: (await usersFetch[1])._id,
        organiser: "Terrifying Tokyo Events",
        price: 0,
    },
    {
        title: "Anime Extravaganza at Luna Park",
        description: "Experience a carnival of anime delights with rides, games, and special screenings under the stars at Luna Park's iconic amusement park.",
        date: new Date("2024-12-15"),
        venue: "Luna Park Melbourne",
        coords: { lat: -37.8693, lng: 144.9771 }, // Luna Park Melbourne coords
        category: (await categoriesFetch[0])._id,
        picture: "",
        pictureUrl: "",
        anime: "Other",
        createdBy: (await usersFetch[1])._id,
        organiser: "Luna Park Melbourne",
        price: 0,
    },
]

await Event.deleteMany()
console.log("Deleted events")
await Event.insertMany(events)
console.log("Added events")

closeConnection()
