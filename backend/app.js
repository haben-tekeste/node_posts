const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

//
require("dotenv").config();

const feedRoutes = require("./routes/feed");

const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To accept the file pass `true`, like so:
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    // To reject this file pass `false`, like so:
    cb(null, false);
  }
};
app.use(cors());
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images"))); //serving static images
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
//

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log("error", error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({ message });
});

mongoose
  .connect(process.env.MONGO_DB_URI.toString())
  .then(() => {
    app.listen(8080, () => {
      console.log("connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
