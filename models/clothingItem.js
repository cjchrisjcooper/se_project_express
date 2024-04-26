const mongoose = require("mongoose");
const validator = require("validator");
const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, enum: ["hot", "warm", "cold"], required: true },
  imageUrl: {
    type: String,
    require: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid url",
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("item", clothingItemSchema);
