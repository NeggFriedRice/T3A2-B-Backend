import { closeConnection, Category } from './db.js'

const categories = [
    { name: 'Convention' }, 
    { name: 'Movie Screening' },
    { name: 'Episode Screening' },
    { name: 'Multi-Episode Screening' },
    { name: 'Special Event' }
]

await Category.deleteMany()
console.log('Deleted all categories')
await Category.insertMany(categories)
console.log('Inserted categories')

closeConnection()