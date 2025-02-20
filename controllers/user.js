const User = require("../models/user");
const {setUser}=require("../service/auth")
const bcrypt = require("bcrypt");

async function handleUserSignup(req,res) {
    const {name,email,password} = req.body;

    if(!name || !email || !password)
    {
        return res.status(400).json({error:"All fields are required"});
    }

    try 
    {
        const hashedPassword = await bcrypt.hash(password, 10); 

        const user = await User.create({ name, email, password: hashedPassword });

        console.log("User created:", user);

        return res.redirect("/");
    } 
    catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: "User registration failed" });
    } 
}

async function handleUserLogin(req,res) {
    const {email,password} = req.body;

    if(!email || !password)
    {
        return res.status(400).json({error:"All fields are required"});
    }
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).render("login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ Compare hashed password

    if (!isMatch) {
        return res.status(401).render("login", { error: "Invalid email or password" });
    }
    
    const token=setUser(user);
    
    res.cookie("token",token);

    return res.redirect("/");
}

module.exports = { handleUserSignup ,handleUserLogin };