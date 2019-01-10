const jwt = require("jwt-simple");
const User = require("../models/user");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET_HASHING_KEY);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated
  // We just need to give them a token
  // Note: Passport "done" in the requireSignin middleware puts user on req
  res.send({
    token: tokenForUser(req.user),
    username: req.user.username || "anonym"
  });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  if (!email || !password || !username) {
    return res
      .status(422)
      .send({ error: "You must provide username, email and password" });
  }

  // see if a user given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    console.log("existingUser", existingUser);
    // if a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }

    // if a user  with email does NOT exist, create and save user record
    const user = new User({ username, email, password });

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user), username: user.username });
    });

    // respond to request indicating the user was created
  });
};
