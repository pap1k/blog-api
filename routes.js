import * as Validations from "./validations.js";
import { PostController, UserController } from "./controllers/index.js";
import {
    checkAuth,
    handleValidationErrors,
    encodeFileName,
} from "./utils/index.js";

export default (app, upload) => {
    app.post(
        "/auth/login",
        Validations.login,
        handleValidationErrors,
        UserController.login
    );
    app.get("/auth/me", checkAuth, UserController.getMe);
    app.post(
        "/auth/register",
        Validations.register,
        handleValidationErrors,
        UserController.register
    );

    app.get("/posts/", (req, res) => {
        res.redirect("page/1");
    });
    app.get("/posts/page/:num", PostController.getAll);
    app.get("/posts/:id", PostController.getOne);
    app.post(
        "/posts",
        checkAuth,
        Validations.postCreate,
        handleValidationErrors,
        PostController.create
    );
    app.post("/posts/restore/:id", checkAuth, PostController.restore);
    app.delete("/posts/:id", checkAuth, PostController.remove);
    app.patch(
        "/posts/:id",
        checkAuth,
        Validations.postCreate,
        handleValidationErrors,
        PostController.update
    );

    app.post("/upload", checkAuth, upload.single("file"), (req, res) => {
        return res.json({
            success: true,
            url: `/uploads/${encodeFileName(req.file.originalname)}`,
        });
    });
};
