
const generateAccessToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

export default generateAccessToken;