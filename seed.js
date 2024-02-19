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
    { title: "Sousou no Frieren",
      description: "Episodes 1 - 10 marathon",
      date: new Date(),
      category: "65d2d1572e99b8c3d3229cfb"
    },
    { title: "Steins;Gate: The Movie - Load Region of Deja Vu",
      description: "Movie screening",
      date: new Date(),
      category: "65d2d1572e99b8c3d3229cf9"
    },
    { title: "Oz Comic-Con",
      description: "Comic-Con - The ultimate pop culture event!",
      date: new Date(),
      category: "65d2d1572e99b8c3d3229cf8"
    },
    { title: "Kojima Meet & Greet",
      description: "Meet the madman behind Death Stranding",
      date: new Date(),
      category: "65d2d1572e99b8c3d3229cfc"
    }
]

await Event.deleteMany()
console.log('Deleted events')
await Event.insertMany(events)
console.log('Added events')

closeConnection()