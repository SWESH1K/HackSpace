import express from "express"
import eventRouter from "./event.routes.js"

const router = express.Router()

router.get('/api/user', (req, res) => {
    res.json(req.oidc.user)
});

router.use("/api/event", eventRouter)


export default router;