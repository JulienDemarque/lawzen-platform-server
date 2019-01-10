const passport = require("passport");
const Authentication = require("./controllers/authentication");
const LawAPI = require("./controllers/laws-api");
const passportService = require("./services/passport");
const Law = require("./models/law");
const User = require("./models/user");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  //LAW API
  // Create a new LAW
  app.post("/law", requireAuth, LawAPI.postNewLaw);

  //Get recent LAWS
  app.get("/recent/pages/:page", LawAPI.getRecentPerPage);

  //Get top LAWS
  app.get("/top/pages/:page", LawAPI.getTopPerPage);

  //Get 5 recent LAWS
  app.get("/recent", LawAPI.getFiveRecent);

  //Get 5 top LAWS
  app.get("/top", LawAPI.getTopFive);

  // Upvote a LAW
  app.post("/upvote/:lawTitle", requireAuth, LawAPI.upvoteLaw);

  //AUTH
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
};
