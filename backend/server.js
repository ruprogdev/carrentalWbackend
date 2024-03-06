const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Assuming the User model is located in a directory named models at the root of your backend project
// Adjust the path to match the actual location of your User model file
const User = require('./models/user');

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

// Serve carrental.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'carrental', 'carrental.html'));
});

// User Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // User Login Endpoint - Insert here
app.post('/login', async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });
      if (user && await bcrypt.compare(req.body.password, user.password)) {
          res.send({ message: "Login successful" });
      } else {
          res.status(401).send({ message: "Login failed" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error logging in" });
  }
});

    // Save the user in the database
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating the user" });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
