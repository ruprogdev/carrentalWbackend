const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const dbName = "carrentalDB";
const dbURI = `mongodb://localhost:27017/${dbName}`;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Middleware
app.use(express.static(path.join(__dirname, '..', 'frontend', 'carrental')));
app.use(express.json()); // Parse JSON bodies

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey', // Better practice
  store: MongoStore.create({ mongoUrl: dbURI }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true } //set secure to true if using https
}));

// Serve carrental.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'carrental', 'carrental.html'));
});

// User Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
        // Save the user in the database
        await user.save();
        res.status(201).send({ message: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error creating the user" });
      }
    });

    // User Login Endpoint - Insert here
app.post('/login', async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });
      if (user && await bcrypt.compare(req.body.password, user.password)) {

        req.session.userId = user._id;
        res.send({ message: "Login successful" });

      } else {
          res.status(401).send({ message: "Login failed" });
      }

  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Login failed" });
  }
});

//logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send({ message: "Logged out successfully" });
  });
});

//middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send({ message: "Not authenticated" });
  }
}

// example of a protected route

app.get('/protected', isAuthenticated, (req, res) => {
  res.send({ message: "This is a protected route" });
});

//endpoint to authentication status

app.get('/auth/status', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
