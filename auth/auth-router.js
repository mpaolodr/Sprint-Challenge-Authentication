const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bc = require("bcryptjs");

const Auth = require("./auth-models.js");

router.post("/register", async (req, res) => {
  // implement registration
  let { username, password } = req.body;

  if (username && password) {
    try {
      bc.hash(password, 10, async (err, hash) => {
        if (err) {
          res
            .status(500)
            .json({
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

router.post("/login", (req, res) => {
  // implement login
});

module.exports = router;
