const roleMiddleware = (requiredRole) => {
    return (request, response, next) => {
        try {
            if (!request.user) {
                return response.status(401).json({
                    message: "Unauthorized: No user information found",
                    error: true,
                    success: false
                });
            }

            if (request.user.role !== requiredRole) {
                return response.status(403).json({
                    message: "Forbidden: Insufficient permissions",
                    error: true,
                    success: false
                });
            }

            next();

        } catch (error) {
            return response.status(500).json({
                message: "Error occurred while checking user role",
                error: true,
                success: false
            });
        }
    }
}

export default roleMiddleware;