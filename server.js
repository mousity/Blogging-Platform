const { sequelize, User } = require("./models");
const express = require("express");
const port = 4000;
const app = express();
require('dotenv').config();
app.use(express.json());

/* GET functions for all models */

// Get all USERS
app.get("/users", async (req, res) => {

    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong fetching users!"});
    }

})

/* GET SPECIFIC INSTANCE OF functions for all models */

// Get SPECIFIC USER
app.delete("/user/:id", async (req, res) => {
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

app.post("/users", async (req, res) => {

    try {
        const user = await User.create(req.body);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong! "});
    }
})

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

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // Safer to use than sync() while still performing the same function
    await sequelize.authenticate();
    console.log("running...");
})