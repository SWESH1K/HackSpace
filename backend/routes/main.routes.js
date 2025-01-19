import express from "express";
import eventRouter from "./event.routes.js";
import axios from "axios";
import getAuth0ManagementApiToken from "../utils/getAuth0ManagementApiToken.js";

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

router.use("/api/event", eventRouter);

export default router;