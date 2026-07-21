process.on("uncaughtException", (error) => {
  console.log("uncaughtException", error);
  process.exit(1);
});

import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/db.config";
import ENV_CONFIG from "./config/env.config";
import { verifyMailServerConnection } from "./config/nodemailer.config";
import mongoose from "mongoose";



//dotenv.config()
const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;



//connect database
connectDatabase(DB_URI);


//listen 
const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await verifyMailServerConnection();
});

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(1); //
  });
});

// development ctrl + c
process.on("SIGINT", () => {
  console.log("SIGINT ");
  server.close(async (error) => {
    console.log(error);
    await mongoose.disconnect();
    process.exit(0); //
  });
});

// production (pm2 , docker ...)
process.on("SIGTERM", () => {
  console.log("SIGTERM ");
  server.close(async (error) => {
    console.log(error);
    await mongoose.disconnect();
    process.exit(0); //
  });
});



//npm run start