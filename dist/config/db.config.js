"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = (DB_URI) => {
    mongoose_1.default.connect(DB_URI).then(() => {
        console.log("Database Connected");
    })
        .catch((error) => {
        console.log("-----database connection error-----");
        console.log(error);
    });
};
exports.connectDatabase = connectDatabase;
// import mongoose from "mongoose";
// // connect database function
// export const connectDatabase = () => {
//   mongoose
//     .connect("mongodb://localhost:27017/team_14_db")
//     .then(() => {
//       console.log("database connected");
//     })
//     .catch((error) => {
//       console.log("-------database connection error--------");
//       console.log(error);
//     });
// };
