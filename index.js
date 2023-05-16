import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes.js";
import fs from "fs";
import { encodeFileName } from "./utils/index.js";

const swaggerRawData = fs.readFileSync("swagger.json");

const upload = multer({
    storage: multer.diskStorage({
        destination: (_, __, cb) => {
            cb(null, "uploads");
        },
        filename: (_, file, cb) => {
            cb(null, encodeFileName(file.originalname));
        },
    }),
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerRawData)));

app.listen(process.env.PORT || 1111, (err) => {
    if (err) {
        return console.log(err);
    }

    routes(app, upload);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Произошла ошибка. Проверьте входные данные");
    });

    console.log("Server started");

    mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => console.log("DB connection OK"))
        .catch((err) => console.log("DB connection error:", err));
});
