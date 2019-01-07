var mongoose = require("mongoose");

var lawSchema = mongoose.Schema({
  title: String,
  description: String,
  createdAt: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Law", lawSchema);
