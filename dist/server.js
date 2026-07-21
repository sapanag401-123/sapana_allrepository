"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.on("uncaughtException", (error) => {
    console.log("uncaughtException", error);
    process.exit(1);
});
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
const env_config_1 = __importDefault(require("./config/env.config"));
const nodemailer_config_1 = require("./config/nodemailer.config");
const mongoose_1 = __importDefault(require("mongoose"));
//dotenv.config()
const PORT = env_config_1.default.PORT;
const DB_URI = env_config_1.default.DB_URI;
//connect database
(0, db_config_1.connectDatabase)(DB_URI);
//listen 
const server = app_1.default.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await (0, nodemailer_config_1.verifyMailServerConnection)();
});
process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error);
    server.close(async () => {
        await mongoose_1.default.disconnect();
        process.exit(1); //
    });
});
// development ctrl + c
process.on("SIGINT", () => {
    console.log("SIGINT ");
    server.close(async (error) => {
        console.log(error);
        await mongoose_1.default.disconnect();
        process.exit(0); //
    });
});
// production (pm2 , docker ...)
process.on("SIGTERM", () => {
    console.log("SIGTERM ");
    server.close(async (error) => {
        console.log(error);
        await mongoose_1.default.disconnect();
        process.exit(0); //
    });
});
//npm run start
