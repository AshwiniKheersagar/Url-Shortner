const jwt = require("jsonwebtoken");
const secret = "Ashwini@123";

function setUser(user) {
    return jwt.sign({ _id: user.id, email: user.email,role:user.role }, secret);
}

function getUser(token) {
    if (!token) return null; // Return null if no token is provided

    try 
    {
        return jwt.verify(token, secret);
    } 
    catch (error) 
    {
        return null; // Return null if token verification fails
    }
}

module.exports = { setUser, getUser };
