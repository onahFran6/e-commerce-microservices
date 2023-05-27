import mongoose from "mongoose";
import bluebird from "bluebird";
import config from "../config";

// Connect to MongoDB
const mongoUrl = config.MONGODB_URI;

// console.log("dta", mongoUrl);

mongoose.Promise = bluebird;

const databaseConnection = async (): Promise<void> => {
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("MongoDB server connection successfully established");
    })
    .catch((err) => {
      console.log(
        `MongoDB connection error. Please make sure MongoDB is running. ${err}`
      );
    });
};

export default databaseConnection;
