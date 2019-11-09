const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where({ email })
    .then(([data]) => {
      if (!data) throw new Error("email not found");
      else if (!bcrypt.compareSync(password, data.hash))
        throw new Error("wrong password");
      else
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then(([user]) => {
            if (!user) throw new Error("user not found");
            else res.json(user);
          })
          .catch(err => res.status(400).json("unable to get user"));
    })
    .catch(err => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin
};
