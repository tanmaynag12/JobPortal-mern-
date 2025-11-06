import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated, no token provided.",
                success: false,
            });
        }

        // 1. jwt.verify is synchronous, no 'await' needed.
        // 2. This will throw an error if the token is invalid or expired.
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        // 3. Attach the user ID to the request object
        req.id = decode.userId; 

        // 4. Call next() to proceed
        next();

    } catch (error) {
        // 5. THIS IS THE FIX
        // This block will run if the token is expired or has an invalid signature.
        console.log(error); // Keep this for debugging
        return res.status(401).json({
            message: "Invalid or expired token.",
            success: false,
        });
    }
}
export default isAuthenticated;