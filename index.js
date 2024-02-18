import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()

app.listen(process.env.PORT || 4000)