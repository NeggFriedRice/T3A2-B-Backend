import { closeConnection, Category } from './db.js'

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

closeConnection()