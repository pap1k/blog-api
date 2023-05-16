import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import { sendError, sendSuccess } from "../utils/index.js";

const getUserData = (userDoc) => {
    const { createdAt, updatedAt, __v, passwordHash, ...data } = userDoc;
    return data;
};

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const db = await UserModel.find({ email: req.body.email });
        if (db)
            return sendError(
                req,
                res,
                400,
                "Пользователь с такой почтой уже существует"
            );

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "30d",
            }
        );

        return sendSuccess(res, {
            ...getUserData(user._doc),
            token,
        });
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось авторизоваться");
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) return sendError(req, res, 401, "Неверный логин или пароль");

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass)
            return sendError(req, res, 401, "Неверный логин или пароль");

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "30d",
            }
        );

        return sendSuccess(res, {
            ...getUserData(user._doc),
            token,
        });
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось авторизоваться");
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "пользователь не найден",
            });
        }

        res.json(getUserData(user._doc));
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "не удалось получить пользователя",
        });
    }
};
