import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import path from "path"

dotenv.config() // Load the .env variables

const __dirname = path.resolve() // BASE_DIR

const app = express()

const SERVER_PORT = 5000 // Port of the server

app.use(express.json()) // allows us to accept json data in req.body

app.listen(SERVER_PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${SERVER_PORT}`)
})