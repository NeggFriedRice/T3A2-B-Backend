import { closeConnection, Category, Event, User } from './db.js'
import bcrypt from 'bcrypt'

// Define the categories to be inserted
const categories = [
    { name: 'Convention' }, 
    { name: 'Movie Screening' },
    { name: 'Episode Screening' },
    { name: 'Multi-Episode Screening' },
    { name: 'Special Event' }
]


await Category.deleteMany() // Deletes all categories 
console.log('Deleted all categories')  
await Category.insertMany(categories) // Inserts the predefined categories
console.log('Inserted categories')

// Define events to be inserted
const events = [
    { title: "Animarathon Bonanza - Sousou no Frieren",
      description: "Episodes 1 - 10 marathon",
      anime: "Sousou no Frieren",
      date: "2024-02-06",
      category: "65d2d1572e99b8c3d3229cfb"
    },
    { title: "Popcorn;Gate: Load Region of Deja Vu",
      description: "Movie screening",
      anime: "Steins;Gate",
      date: "2025-02-01",
      category: "65d2d1572e99b8c3d3229cf9"
    },
    { title: "Oz Comic-Con",
      description: "Comic-Con - The ultimate pop culture event!",
      date: "2024-06-08",
      category: "65d2d1572e99b8c3d3229cf8"
    },
    { title: "Kojima Meet & Greet",
      description: "Meet the madman behind Death Stranding",
      date: "2024-04-05",
      category: "65d2d1572e99b8c3d3229cfc"
    },
    { title: "The Texas Chainsaw Man Watch Party",
    description: "For those who haven't seen Chainsaw Man, come join us for a watch party at your local cinemas",
    anime: "Chainsaw Man",
    date: "2024-04-05",
    category: "65d2d1572e99b8c3d3229cfc"
    },
    { title: "Throwback Thursdays: Cowboy Bebop Saga",
    description: "The plan is to kick back and enjoy some old school cool Cowboy Bebop. We've got popcorn, we've got drinks, we've got bean bags!",
    anime: "Cowboy Bebop",
    date: "2024-04-05",
    category: "65d2d1572e99b8c3d3229cfc"
    },
    { title: "Zoom Zoom Anime, Coffee & Cars Meet",
    description: "Come by to watch some Initial D Stage 5 episodes and meet other like minded car enthusiasts",
    anime: "Initial D",
    date: "2024-04-05",
    category: "65d2d1572e99b8c3d3229cfc"
    },
]

await Event.deleteMany()
console.log('Deleted events')
await Event.insertMany(events)
console.log('Added events')

// Define users to be inserted
const users = [
    { username: 'administrator', password: 'admin', isAdmin: true},
    { username: 'organiser', password: 'organiser', isOrganiser: true },
    { username: 'user', password: 'user' }
]

// Hash the passwords
const saltRounds = 10 // Number of salt rounds for hashing the password

for (let user of users) {
    const salt = await bcrypt.genSalt(saltRounds) // Generate a salt
    user.password = await bcrypt.hash(user.password, salt) // Hash the password
    user.salt = salt
}

await User.deleteMany()
console.log("Deleted users")
await User.insertMany(users)
console.log("Added users")

closeConnection()