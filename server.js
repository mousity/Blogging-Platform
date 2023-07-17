const { sequelize, User, Post, Comment } = require("./models");
const express = require("express");
const port = 4000;
const bcrypt = require("bcryptjs");
const app = express();
const session = require('express-session');
require('dotenv').config();
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 // 1 hour
    },
  }));
  
const authenticateUser = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'You must be logged in to view this page.' });
    }
    next();
  };
/* GET functions for all models */

// Get all USERS
app.get("/users", authenticateUser, async (req, res) => {

    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        
        return res.status(500).send({ message: "Something went wrong fetching users!"});
    }

})

/* GET SPECIFIC INSTANCE OF functions for all models */

// Get SPECIFIC USER
app.get("/user/:id", authenticateUser, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        // Destroy a recipe specified by the id
        const user = await User.findOne({ where: {id: userId} });
        console.log("User deleted");
        return res.status(200).json(user);
    } catch (err) {
        return res.status(404).send({ message: "User not found"});
    }
})


/* POST functions for all models */

app.post("/users", authenticateUser, async (req, res) => {

    try {
        const user = await User.create(req.body);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong! "});
    }
})

app.post("/posts/:id", authenticateUser, async (req, res) => {
    const currId = parseInt(req.params.id, 10);
    if(req.session.userId != currId) {
        return res.status(201).send({ message: "You cannot post on this user's page!"})
    }
    console.log(req.body.body);
    try {
        console.log(req.body.body);
        console.log(currId);

        const uPost = await Post.create({
            body: req.body.body,
            userId: currId,
            created_at: new Date(),
            updated_at: new Date()
        }, {
            raw: true, 
        });

        return res.status(200).json(uPost);
    } catch (err) {
        return res.status(500).send({ message: err.message  });
    }
})

app.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
    try {
        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
    
        // Send a response to the client informing them that the user was successfully created
        res.status(201).json({
          message: "User created!",
          user: {
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          return res.status(422).json({ errors: error.errors.map((e) => e.message) });
        }
        res.status(500).json({
          message: "Error occurred while creating user",
          error: error,
        });
      }
  });

  app.post('/login', async (req, res) => {
    try {
      // First, find the user by their email address
      const user = await User.findOne({ where: { email: req.body.email } });
  
      if (user === null) {
        // If the user isn't found in the database, return an 'incorrect credentials' message
        return res.status(401).json({
          message: 'Incorrect credentials',
        });
      }
  
      // If the user is found, we then use bcrypt to check if the password in the request matches the hashed password in the database
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (result) {
          // Passwords match
          // TODO: Create a session for this user
          req.session.userId = user.id;
          res.status(200).json({
            message: 'Logged in successfully',
            user: {
              name: user.name,
              email: user.email,
            },
          });
        } else {
          // Passwords don't match
          res.status(401).json({ message: 'Incorrect credentials' });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred during the login process' });
    }
  });
/* PUT functions for all models */


/* PATCH functions for all models */


/* DELETE functions for all models */

// Delete a SPECIFIC USER
app.delete("/user/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        // Destroy a recipe specified by the id
        const user = await User.destroy({ where: {id: userId} });
        console.log("User deleted");
        return res.status(200).json(user);
    } catch (err) {
        return res.status(404).send({ message: "User not found"});
    }
})

app.delete('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.sendStatus(500);
        }

        res.clearCookie('connect.sid');
        return res.sendStatus(200);
    });
});

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // Safer to use than sync() while still performing the same function
    await sequelize.authenticate();
    console.log("running...");
})