const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const News = new Schema(
  {
    avtUrl: String,
    title: String,
    description: String,
    views: Number,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("news", News);
