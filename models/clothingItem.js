const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, enum: ["hot", "warm", "cold"] },
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
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  createdAt: { type: Date },
});

module.exports = mongoose.model("item", clothingItemSchema);
