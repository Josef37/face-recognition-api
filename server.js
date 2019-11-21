const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const signout = require("./controllers/signout");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const auth = require("./helper/authorization");

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.post("/signin", signin.signinAuthentication);
app.post("/signout", signout.handleSignout);
app.post("/register", register.handleRegister);
app.get("/profile/:id", auth.requireAuth, profile.handleProfileGet);
app.post("/profile/:id", auth.requireAuth, profile.handleProfileUpdate);
app.put("/image", auth.requireAuth, image.handleImage);
app.post("/imageurl", auth.requireAuth, image.handleApiCall);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT || 3000}`);
});
