import './config/env.js'

import { app } from "./app.js";
import connectDb from "./db/connectDb.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is running on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
