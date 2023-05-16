export default (res, payload) => {
    return res.json({
        success: true,
        ...payload,
    });
};
