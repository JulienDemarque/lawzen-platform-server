const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");
const Law = require("./models/law");
const User = require("./models/user");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  // Create a new LAW
  app.post("/law", requireAuth, function(req, res) {
    // Great we are getting the data from the form and the user info decoded
    // Now we need to save the law in mongodb... :)
    console.log("req.body", req.body);
    console.log("req.user", req.user);
    //find the user
    User.findOne({ email: req.user.email }, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log("USER: ", user);
        //Create the law
        const lawObj = {
          title: req.body.lawTitle,
          createdAt: new Date().getTime(),
          description: req.body.lawDescription,
          author: { id: user._id, username: user.username }
        };
        Law.create(lawObj, function(err, law) {
          if (err) {
            console.log(err);
          } else {
            law.save();
            user.laws.push(law);
            user.save();
            console.log("LAW: ", law);
          }
        });
      }
    });
    res.send({ hi: "there Jul" });
  });

  //Get recent LAWS
  app.get("/recent", function(req, res) {
    Law.find({}, function(err, allLaws) {
      if (err) {
        console.log(err);
      } else {
        const fiveMostRecentLaws = allLaws
          .sort((a, b) => {
            return a.createdAt < b.createdAt;
          })
          .slice(0, 5);
        res.send(fiveMostRecentLaws);
      }
    });
  });

  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
};
