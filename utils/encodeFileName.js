import crypto from "crypto";

export default (originalName) => {
    const ext = "." + originalName.split(".").pop();
    return encodeURIComponent(
        crypto.createHash("sha1").update(originalName).digest("hex") + ext
    );
};
