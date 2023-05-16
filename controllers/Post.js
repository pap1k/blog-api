import PostModel from "../models/Post.js";
import { sendError, sendSuccess } from "../utils/index.js";

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOne({ _id: postId, deleted: false })
            .populate("user")
            .exec();
        if (!post) {
            return sendError(
                req,
                res,
                404,
                "Такого поста не существует или у вас нет доступа к его просмотру"
            );
        }

        if (post.user._id.toString() === req.userId) {
            post.body = req.body.body;
            post.media = req.body.media;
            await post.save();

            return sendSuccess(res);
        } else
            return sendError(
                req,
                res,
                404,
                "Такого поста нет или у вас нет доступа к его просмотру"
            );
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось выполнить запрос");
    }
};

export const restore = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOne({ _id: postId, deleted: true });

        if (!post)
            return sendError(
                req,
                res,
                404,
                "Такого поста не существует или у вас нет доступа к его просмотру"
            );

        if (post.user._id.toString() === req.userId) {
            post.deleted = false;
            post.save();
            return sendSuccess(res);
        } else {
            return sendError(
                req,
                res,
                404,
                "Такого поста не существует или у вас нет доступа к его просмотру"
            );
        }
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось получить пост");
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
                deleted: false,
            },
            {
                $inc: { views: 1 },
            },
            {
                returnDocument: "after",
            }
        )
            .populate("user", "_id fullName")
            .exec();
        if (!post) return sendError(req, res, 404, "Пост не найден");
        return sendSuccess(res, post._doc);
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось получить пост");
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOne({ _id: postId, deleted: false });

        if (!post)
            return sendError(
                req,
                res,
                404,
                "Такого поста не существует или у вас нет доступа к его просмотру"
            );

        if (post.user._id.toString() === req.userId) {
            post.deleted = true;
            post.save();
            return sendSuccess(res);
        } else
            return sendError(
                req,
                res,
                404,
                "Такого поста не существует или у вас нет доступа к его просмотру"
            );
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось получить пост");
    }
};

export const getAll = async (req, res) => {
    try {
        const page = req.params.num;
        if (isNaN(page) || page < 1)
            return sendError(req, res, 404, "Такой страницы не существует");

        page = Number(page);

        const toskip = 20;
        const posts = await PostModel.find({ deleted: false })
            .sort("-createdAt")
            .skip((page - 1) * toskip)
            .limit(toskip)
            .populate("user", "_id fullName")
            .exec();

        const totalPosts = await PostModel.count({ deleted: false });
        const pageCount = Math.ceil(totalPosts / toskip);

        return sendSuccess(res, {
            paginator: {
                page,
                pageCount,
            },
            data: posts,
        });
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось получить список постов");
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            body: req.body.body,
            media: req.body.media,
            user: req.userId,
        });

        await doc.save();

        return sendSuccess(res, doc._doc);
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, "Не удалось создать пост");
    }
};
