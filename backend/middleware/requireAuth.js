export const requireAuth = (req, res, next) => {
    // Allow requests in development mode
    if (process.env.NODE_ENV === 'development') {
        req.oidc = {
            isAuthenticated: () => true,
            user: {
                sub: req.oidc.user.sub || 'test-user'  // Use user_id from request body if available
            }
        };
        return next();
    }

    // Regular Auth0 authentication check for production
    if (!req.oidc?.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
            redirectTo: "/login"
        });
    }
    next();
};