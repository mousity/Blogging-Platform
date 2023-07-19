const { sequelize, User, Post, Comment } = require("./models");
const express = require("express");
const port = 4000;
const bcrypt = require("bcryptjs");
const app = express();
const session = require('express-session');
require('dotenv').config();
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 // 1 hour
    },
  }));
  
app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

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

// Get all POSTS
app.get("/posts", authenticateUser, async (req, res) => {

  try {
      const posts = await Post.findAll();
      return res.status(200).json(posts);
  } catch (err) {
      
      return res.status(500).send({ message: "Something went wrong fetching posts!"});
  }

})

// Get all COMMENTS
app.get("/comments", authenticateUser, async (req, res) => {

  try {
      const comments = await Comment.findAll();
      return res.status(200).json(comments);
  } catch (err) {
      return res.status(500).send({ message: "Something went wrong fetching comments!"});
  }
})

// Get all POSTS from a certain user
app.get("users/:userid/posts", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.userid, 10);
  try {
    const posts = await Post.findAll({where: { user_id: userId } });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong fetching posts by this user!" })
  }
})

// Get all COMMENTS associated with a certain post
app.get("/posts/:id/comments", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.userid, 10);
  try {
    const comments = await Comment.findAll({where: { post_id: postId } });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong fetching comments associated with this post!" })
  }
})

// Get all COMMENTS associated with a certain user
app.get("/users/:id/comments", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.userid, 10);
  try {
    const comments = await Comment.findAll({where: { user_id: userId } });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong fetching comments associated with this user!" })
  }
})


/* GET SPECIFIC INSTANCE OF functions for all models */
// Get SPECIFIC USER
app.get("/users/:id", authenticateUser, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        // Destroy a recipe specified by the id
        const user = await User.findOne({ where: {id: userId} });
        console.log("User found");
        return res.status(200).json(user);
    } catch (err) {
        return res.status(404).send({ message: "User not found" });
    }
})

app.get("/posts/:id", authenticateUser, async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    try {
      const post = await Post.findOne({ where: { id: postId } });
      console.log("Post found");
      return res.status(200).json(post);
    } catch (err) {
      return res.status(404).send({ message: "Post not found" })
    }
})

app.get("/posts/:postid/comments/:id", async (req, res) => {
  const commentId = parseInt(req.params.id, 10);

  try {
    const comment = await Comment.findOne({ where: {id: commentId } });
    console.log("Comment found");
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(404).send({ message: "Comment not found" })
  }
})


/* POST functions for all models */
// Post on the current logged in users page
app.post("users/:userid/posts/", authenticateUser, async (req, res) => {
    const currId = parseInt(req.params.userid, 10);
    if(req.session.userId != currId) {
        return res.status(201).send({ message: "You cannot post on this user's page!"})
    }
    try {
        console.log(req.body.body);
        console.log(currId);

        const uPost = await Post.create({
            body: req.body.body,
            user_id: currId,
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

// Post a comment on a user's post
app.post("/posts/:id/comments", authenticateUser, async (req, res) => {
    const currPostId = parseInt(req.params.id, 10);
    console.log("in here!")
    try {
        const comment = await Comment.create({
            body: req.body.body,
            user_id: req.session.userId,
            post_id: currPostId,
            created_at: new Date(),
            updated_at: new Date()
        }, {
            raw: true,
        });
        return res.status(200).json(comment);
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
})

// Allow the user to signup
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


  // Allow for user login
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

app.patch("/posts/:id", async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await Post.findOne({ where: { id: postId, user_id: req.session.id }})
  if (!post) {
    return res.status(401).send({ message: "You cannot edit another user's post!" })
  }

  try {
    const [numberOfAffectedRows, affectedRows] = await Post.update(req.body, { where: { id: postId }, returning: true });

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.error(err);
  }
});

app.patch("/posts/:postid/comments/:id", async (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  const comment = await Comment.findOne({ where: { id: commentId, user_id: req.session.id }})
  if (!comment) {
    return res.status(401).send({ message: "You cannot edit another user's comment!" })
  }

  try {
    const [numberOfAffectedRows, affectedRows] = await Comment.update(req.body, { where: { id: commentId }, returning: true });

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.error(err);
  }
});

/* DELETE functions for all models */
// Delete a SPECIFIC USER
app.delete("/user/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if(req.session.userId != userId) {
        return res.status(201).send({ message: "You cannot delete this user's page!"})
    }
    try {
        // Destroy a user specified by the id
        const user = await User.destroy({ where: {id: userId} });
        console.log("User deleted");
        return res.status(200).json(user);
    } catch (err) {
        return res.status(404).send({ message: "User not found"});
    }
})

app.delete("/post/:id/comments/:commentid", async (req, res) => {
    const commentId = parseInt(req.params.commentid, 10);
    const comment = await Comment.findOne({ where: { id: commentId, user_id: req.session.id }})
    if (!comment) {
      return res.status(401).send({ message: "You cannot delete another user's comment!" })
    }
    try {
        // Destroy a comment specified by the id
        const comment = await Comment.destroy({ where: {id: commentId} });
        console.log("Comment deleted");
        return res.status(200).json(comment);
    } catch (err) {
        return res.status(404).send({ message: "Comment not found"});
    }
})

app.delete("/post/:id", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await Post.findOne({ where: { id: postId, user_id: req.session.id }})
    if (!post) {
      return res.status(401).send({ message: "You cannot delete another user's post!" })
    }
    try {
        // Destroy a post specified by the id
        const post = await Post.destroy({ where: {id: postId} });
        console.log("Post deleted");
        return res.status(200).json(post);
    } catch (err) {
        return res.status(404).send({ message: "Post not found"});
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