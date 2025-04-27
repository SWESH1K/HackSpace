import express from "express";
import eventRouter from "./event.routes.js";
import eventDetailsRouter from "./eventDetails.routes.js";
import hackathonProfileRouter from "./hackathon_profile.routes.js";
import teamRouter from "./team.routes.js";
import axios from "axios";
import getAuth0ManagementApiToken from "../utils/getAuth0ManagementApiToken.js";
import { requireAuth } from "../middleware/requireAuth.js";
import admin from "firebase-admin"; // Firebase Admin SDK


const router = express.Router();

router.get('/api/user', (req, res) => {
    res.json(req.oidc.user);
});

router.get('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const token = await getAuth0ManagementApiToken();
        const response = await axios.get(`${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = response.data;
        res.status(200).json({ name: user.name, picture: user.picture });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
});

router.get('/auth/firebase', async (req, res) => {
    const uid = req.user.sub; // Auth0 user ID

    try {
        const customToken = await admin.auth().createCustomToken(uid);
        res.json({ firebaseToken: customToken });
    } catch (err) {
        res.status(500).send({
            message: 'Something went wrong acquiring a Firebase token.',
            error: err.message
        });
    }
});

router.use("/api/event", eventRouter);
router.use("/api/event-details", eventDetailsRouter);

// Protected routes - require authentication
router.use("/api/hackathon-profile", requireAuth, hackathonProfileRouter);
router.use("/api/team", requireAuth, teamRouter);

export default router;