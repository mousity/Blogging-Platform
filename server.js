const { sequelize, User } = require("./models");
const express = require("express");
const port = 4000;
const app = express();
require('dotenv').config();
app.use(express.json());

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // Safer to use than sync() while still performing the same function
    await sequelize.authenticate();
    console.log("running...");
})