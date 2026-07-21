"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
// import authRoutes from "./routes/auth.routes";
//importing routes
const routes_1 = __importDefault(require("./routes"));
// @types/express
//creating app instance
const app = (0, express_1.default)();
//using malwares
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
//heaith route
app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Server is up & running",
        success: true,
        status: "success",
        data: null,
    });
});
//using routes
app.use("/api/v1", routes_1.default);
app.use("/api/v1/brands", brand_routes_1.default);
app.use("/api/v1/products", product_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
// app.use("/api/v1/user", userRoutes);
//path not found
app.get("/", (req, res, next) => {
    const message = `Can not ${req.method} on $(req.path)`;
    // res.status(200).json({
    //     message: "Server is up & running",
    //     success: true,
    //     status: "success",
    //     data: null,
    // });
    const error = new Error(message);
    error.status = "fail",
        error.statusCode = 404;
    next(error);
});
//error handler
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
