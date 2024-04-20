const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const express = require("express");
//setting up our express app
const app = express();
//connecting to our local server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("You have connected successfully to your local database");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
