const Law = require("../models/law");
const User = require("../models/user");

// POST New Law
exports.postNewLaw = function(req, res) {
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
};

// GET Single Law
exports.getSingleLaw = function(req, res) {
  Law.findOne({ title: req.params.title })
    .populate("upVotes", "username", User)
    .exec(function(err, law) {
      if (err) {
        console.log(err);
      } else {
        // console.log("law line 40 laws-api", law)
        res.send(law);
      }
    });
};

// GET Recent Laws Per Page
exports.getRecentPerPage = function(req, res) {
  const page = req.params.page;
  const beginning = (page - 1) * 5;
  Law.find({})
    .populate("upVotes", "username", User)
    .exec(function(err, allLaws) {
      if (err) {
        console.log(err);
      } else {
        const pageLaws = allLaws
          .sort((a, b) => {
            return b.createdAt - a.createdAt;
          })
          .slice(beginning, beginning + 5);

        res.send(pageLaws);
      }
    });
};

// GET Top Laws Per Page
exports.getTopPerPage = function(req, res) {
  const page = req.params.page;
  const beginning = (page - 1) * 5;
  Law.find({})
    .populate("upVotes", "username", User)
    .exec(function(err, allLaws) {
      if (err) {
        console.log(err);
      } else {
        const pageLaws = allLaws
          .sort((a, b) => {
            return b.upVotes.length - a.upVotes.length;
          })
          .slice(beginning, beginning + 5);
        res.send(pageLaws);
      }
    });
};

// GET 5 Recent Laws
exports.getFiveRecent = function(req, res) {
  Law.find({})
    .populate("upVotes", "username", User)
    .exec(function(err, allLaws) {
      if (err) {
        console.log(err);
      } else {
        const fiveMostRecentLaws = allLaws
          .sort((a, b) => {
            return b.createdAt - a.createdAt;
          })
          .slice(0, 5);
        res.send(fiveMostRecentLaws);
      }
    });
};

// GET 5 Top Laws
exports.getTopFive = function(req, res) {
  Law.find({})
    .populate("upVotes", "username", User)
    .exec(function(err, allLaws) {
      if (err) {
        console.log(err);
      } else {
        // console.log("ALL LAWS: ", allLaws);
        const fiveTopLaws = allLaws
          .sort((a, b) => {
            // console.log("a: ", a.title, a.upVotes.length);
            // console.log("b: ", b.title, b.upVotes.length);
            return b.upVotes.length - a.upVotes.length;
          })
          .slice(0, 5);
        // console.log("FIVE TOP LAWS: ", fiveTopLaws);
        res.send(fiveTopLaws);
      }
    });
};

// POST Upvote (or downvote) Law
exports.upvoteLaw = function(req, res) {
  // console.log("req.body", req.body);
  // console.log("req.user", req.user);

  Law.findOne({ title: req.body.lawTitle })
    .populate("upVotes", "username", User)
    .exec(function(err, law) {
      if (err) {
        console.log(err);
      } else {
        // console.log("law line 70", law);
        User.findOne({ username: req.user.username }, function(err, user) {
          if (err) {
            console.log(err);
          } else {
            // console.log("user line 75", user);
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
};
