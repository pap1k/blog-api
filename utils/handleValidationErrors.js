import { validationResult } from "express-validator";
import sendError from "./sendError.js";

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(req, res, 400, errors.array());
    next();
};
