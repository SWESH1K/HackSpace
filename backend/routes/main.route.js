import express from "express"

const router = express.Router()

router.get('/api/user', (req, res) => {
    res.json(req.oidc.user)
});

export default router;