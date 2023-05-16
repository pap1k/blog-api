export default (req, res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
