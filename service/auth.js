const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // Load from environment

function setUser(user) {
    return jwt.sign({ _id: user.id, email: user.email, role: user.role }, JWT_SECRET);
}

function getUser(token) {
    if (!token) return null; // Return null if no token is provided

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null; // Return null if token verification fails
    }
}

module.exports = { setUser, getUser };
