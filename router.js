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
    // console.log("req.body", req.body);
    // console.log("req.user", req.user);
    //find the user
    User.findOne({ email: req.user.email }, function(err, user) {
      if (err) {
        console.log(err);
      } else {
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
          }
        });
      }
    });
    res.send({ hi: "there Jul" });
  });

  //Get recent LAWS
  app.get("/recent", function(req, res) {
    Law.find({})
      .populate("upVotes", "username", User)
      .exec(function(err, allLaws) {
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

  // Upvote a LAW
  app.post("/upvote/:lawTitle", requireAuth, function(req, res) {
    console.log("req.body", req.body);
    console.log("req.user", req.user);

    Law.findOne({ title: req.body.lawTitle })
      .populate("upVotes", "username", User)
      .exec(function(err, law) {
        if (err) {
          console.log(err);
        } else {
          console.log("law line 70", law);
          User.findOne({ username: req.user.username }, function(err, user) {
            if (err) {
              console.log(err);
            } else {
              console.log("user line 75", user);
              // check if the user is already in the array of the law
              const userAlreadyVotedUp = law.upVotes.find(voters => {
                return voters.username === user.username;
              });

              if (userAlreadyVotedUp) {
                // if already in the list, remove it
                law.upVotes = law.upVotes.filter(voters => {
                  return voters.username !== user.username;
                });
              } else {
                // if not in the list, add the user to the list
                law.upVotes.push(user);
              }
              law.save();
              res.send(err || "saved your vote!");
            }
          });
        }
      });
  });

  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
};
