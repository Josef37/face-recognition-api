const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "1234",
    database: "smartbrain"
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfileGet(db));
app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleApiCall);

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
