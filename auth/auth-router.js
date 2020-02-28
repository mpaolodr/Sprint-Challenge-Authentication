const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bc = require("bcryptjs");

const Auth = require("./auth-models.js");

const { jwtSecret } = require("../api/config/secrets.js");

router.post("/register", async (req, res) => {
  // implement registration
  let { username, password } = req.body;

  if (username && password) {
    try {
      bc.hash(password, 10, async (err, hash) => {
        if (err) {
          res.status(500).json({
            error: "Sorry. We're having problems. Please try again later"
          });
        } else {
          password = hash;
          const user = await Auth.add({ username, password });

          res.status(201).json(user);
        }
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "User cannot be registered at this moment" });
    }
  } else {
    res.status(400).json({ error: "Please provide required fields!" });
  }
});

router.post("/login", async (req, res) => {
  // implement login
  const { username, password } = req.body;

  if (username && password) {
    try {
      const user = await Auth.getBy({ username });

      if (user && bc.compareSync(password, user.password)) {
        const token = signInToken(user);
        res.status(200).json({ token, id: user.id });
      } else {
        res
          .status(404)
          .json({ error: "No user with those credentials was found" });
      }
    } catch (err) {
      res.status(404).json({ error: "User can't be found" });
    }
  } else {
    res.status(400).json({ error: "Please provide username and password!" });
  }
});

function signInToken(user) {
  const payload = {
    userId: user.id
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
