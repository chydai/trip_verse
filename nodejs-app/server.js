import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();
const port = process.env.PORT || 8080;

const connect = () => {
  mongoose
    .set("strictQuery", false)
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to MongoDb");
    })
    .catch((err) => {
      throw err;
    });
};

app.listen(port, () => {
  connect();
  console.log("Connected to server");
});
