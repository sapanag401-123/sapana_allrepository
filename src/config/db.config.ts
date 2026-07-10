// import mongoose from "mongoose"

// export const connectDatabase = (DB_URI: string) => {
//     mongoose.connect(DB_URI).then(() =>{
//         console.log("Database Connected");
//     })
//     .catch((error) => {
//         console.log("-----database connection error-----");
//         console.log(error);
//     })
// }


import mongoose from "mongoose";

// connect database function
export const connectDatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/team_14_db")
    .then(() => {
      console.log("database connected");
    })
    .catch((error) => {
      console.log("-------database connection error--------");
      console.log(error);
    });
};