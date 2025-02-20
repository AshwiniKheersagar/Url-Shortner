const express = require('express');
const path = require('path');
const cookieParser =require('cookie-parser');
const {checkForAuthentication,restrictTo} =require('./middlewares/auth');
const Url = require('./models/url');
const connectToDB = require('./connection');

const { handleRedirectToOriginalURL } = require('./controllers/url'); // ✅ Import Redirect Handler

const urlRoutes = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRoutes = require('./routes/user');

const app = express();
const port = 8000;


// Connect to MongoDB
connectToDB("mongodb://localhost:27017/short-url");

// Set up view engine
app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'));


// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthentication);

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));



// Route for creating short URLs
app.use("/url",restrictTo(["NORMAL","ADMIN"]), urlRoutes);

// Route for user signup
app.use("/user", userRoutes);

// Route for serving static files
app.use('/' , staticRouter);

// ✅ Route for redirecting based on shortId (fix)
app.get('/url/:shortId', handleRedirectToOriginalURL);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
