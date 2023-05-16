import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "./index.js";

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);

            req.userId = decoded._id;
            next();
        } catch (err) {
            return sendError(req, res, 403, "Нет доступа");
        }
    } else {
        return sendError(req, res, 403, "Нет доступа");
    }
};
