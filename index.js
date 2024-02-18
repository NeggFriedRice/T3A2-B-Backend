import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()

app.listen(process.env.PORT || 4000) // Listens on port 4000 if no port is specified in the environment variables