import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler.middleware";
import userRoutes from "./routes/user.routes";

// @types/express
//creating app instance
const app = express();

//using malwares
app.use(express.json({ limit: "10mb"}));


//using routes

//heaith route

app.get("/", (req: Request, res: Response, next: NextFunction) =>{
    res.status(200).json({
        message: "Server is up & running",
        success: true,
        status: "success",
        data: null,
    });

});

//using routes
app.use("/users", userRoutes);


//path not found
app.get("/", (req: Request, res: Response, next: NextFunction) =>{

    const message =`Can not ${req.method} on $(req.path)`;
    // res.status(200).json({
    //     message: "Server is up & running",
    //     success: true,
    //     status: "success",
    //     data: null,
    // });
    const error: any = new Error(message);
    error.status = "fail",
    error.statusCode = 404;
    next(error);


});



//error handler
app.use(errorHandler);


export default app;


