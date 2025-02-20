require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { checkForAuthentication, restrictTo } = require('./middlewares/auth');
const Url = require('./models/url');
const connectToDB = require('./connection');

const { handleRedirectToOriginalURL } = require('./controllers/url');

const urlRoutes = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
connectToDB(MONGODB_URI).then(()=>{
    console.log("✅ MongoDB Connection Established");

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthentication);

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Route for creating short URLs
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoutes);

// Route for user signup
app.use("/user", userRoutes);

// Route for serving static files
app.use('/', staticRouter);

// ✅ Route for redirecting based on shortId (fix)
app.get('/url/:shortId', handleRedirectToOriginalURL);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

}).catch(error => {
    console.error("❌ Failed to connect to MongoDB:", error);
});
