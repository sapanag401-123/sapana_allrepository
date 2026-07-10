import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/db.config";
import ENV_CONFIG from "./config/env.config";

//dotenv.config()
const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;



//connect database
connectDatabase(DB_URI);


//listen 
app.listen(PORT, () =>{
    console.log(`Server is running at http://localhost:${PORT}`);
});

//npm run start