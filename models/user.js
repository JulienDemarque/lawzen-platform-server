const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

// Define our model
const userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, lowercase: true },
  password: String,
  laws: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Law"
    }
  ]
});

// On save hook, encrypt password
userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isNew) {
    next();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Create the model class
const modelClass = mongoose.model("user", userSchema);

// Export the model
module.exports = modelClass;
