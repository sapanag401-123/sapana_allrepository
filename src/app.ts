import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler.middleware";
import cookieParser from "cookie-parser";
import brandRoutes from "./routes/brand.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";


// import authRoutes from "./routes/auth.routes";


//importing routes

import routes from "./routes";

// @types/express
//creating app instance
const app = express();

//using malwares
app.use(express.json({ limit: "10mb"}));
app.use(cookieParser());


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
app.use("/api/v1", routes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);



// app.use("/api/v1/user", userRoutes);



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


