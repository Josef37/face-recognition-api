const handleProfileGet = db => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(([user]) => {
      if (user) res.json(user);
      else res.status(400).json("not found");
    })
    .catch(err => res.status(400).json("error getting user"));
};

const handleProfileUpdate = db => (req, res) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name, age, pet })
    .then(response => {
      if (response) return res.json("success");
      else res.status(400).json("unable to update");
    })
    .catch(err => res.status(400).json("error updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate
};
