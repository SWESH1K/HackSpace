import express from "express"

const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

export default router;