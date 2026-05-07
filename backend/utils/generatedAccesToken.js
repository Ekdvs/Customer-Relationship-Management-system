import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
 // Debugging log
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn: '1h' });
    return token;
}

export default generateAccessToken;