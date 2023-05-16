import { body } from "express-validator";

export const register = [
    body("email", "Неверно указана почта").isEmail(),
    body("password", "Длина пароля должна быть больше 5 символов").isLength({
        min: 5,
    }),
    body("fullName", "Длина имени не может быть меньше 1 символа").isLength({
        min: 1,
    }),
    body("avatarUrl", "Неверно указана ссылка на аватарку").optional().isURL(),
];

export const login = [
    body("email", "Неверно указана почта").isEmail(),
    body("password", "Длина пароля должна быть больше 5 символов").notEmpty(),
];

export const postCreate = [
    body("body", "Поле текста не может быть пустым").notEmpty(),
    body("media", "Неверно перданы ссылки на меда")
        .optional()
        .isArray()
        .isURL(),
];
