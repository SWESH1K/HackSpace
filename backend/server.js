import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import path from "path"
import { auth } from 'express-openid-connect'
import mainRoute from './routes/main.route.js'

const app = express()
dotenv.config() // Load the .env variables

const inProduction = process.env.NODE_ENV == 'production'

// Auth0 Config
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const __dirname = path.resolve() // BASE_DIR

const SERVER_PORT = 5000 // Port of the server

app.use(express.json()) // allows us to accept json data in req.body

// Use the main routes
app.use('/', mainRoute)

// This will run only in production
if (inProduction) {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(SERVER_PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${SERVER_PORT}`)
})