const { db } = require("../helper/init");
const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("unable to work with api"));
};

const handleImage = (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(([entries]) => {
      if (entries) res.json(entries);
      else throw new Error(`user with id ${id} not found`);
    })
    .catch(err => res.status(400).json("unable to count entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
