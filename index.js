import dotenv from "dotenv"
import app from "./app.js"

dotenv.config() // Load environment variables

app.listen(process.env.PORT || 4000) // Start the server on port 4000
