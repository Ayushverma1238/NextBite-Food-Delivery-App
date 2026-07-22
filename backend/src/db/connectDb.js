import mongoose from "mongoose";
import { DB_NAME } from "../utils/contant.js";

const connectDb = async () => {
  try {
    
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `\n Mongo db connected successfully to ${connectionInstance} \n`,
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDb;
