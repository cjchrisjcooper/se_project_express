const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("You have connected successfully to your local database");
  })
  .catch((err) => {
    console.log(err);
  });
// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
//   };
//   next();
// });
app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
