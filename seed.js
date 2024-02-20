import { closeConnection, Category, Event } from './db.js'

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
    }
]

await Event.deleteMany()
console.log('Deleted events')
await Event.insertMany(events)
console.log('Added events')

closeConnection()