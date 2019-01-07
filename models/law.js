var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var lawSchema = mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  createdAt: Number,
  upVotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Law", lawSchema);
