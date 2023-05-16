import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        views: {
            type: Number,
            default: 0,
        },
        media: {
            type: Array,
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", PostSchema);
