// require('dotenv').config({path: './env'}) //we could import dotenv this way but we are following module approach(ES6)

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js';

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(` Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed :(", err);
  });

// One of the ways to connect to database
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
/*
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("errror", () => {
        console.log("ERRRRRROR: ", error);
        throw error;
    })
    app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.error("ERROR: ", error);
    throw err;
  }
})();
*/
