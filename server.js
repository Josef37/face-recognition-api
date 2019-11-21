const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const morgan = require("morgan");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const auth = require("./controllers/authorization");
const image = require("./controllers/image");
const db = require("knex")({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.post("/signin", signin.signinAuthentication(db, bcrypt));
app.post("/signout", signin.signout);
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", auth.requireAuth, profile.handleProfileGet(db));
app.post("/profile/:id", auth.requireAuth, profile.handleProfileUpdate(db));
app.put("/image", auth.requireAuth, image.handleImage(db));
app.post("/imageurl", auth.requireAuth, image.handleApiCall);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT || 3000}`);
});
