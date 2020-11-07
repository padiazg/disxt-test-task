const debug = require("debug")("verify-token");
const jwt = require("jsonwebtoken");
const Session = require("../model/session");

module.exports = async (req, res, next) => {
    const t0 = req.header("Authorization");
    if (!t0) return res.status(401).send("No authorization token provided");

    try {
        const token = t0.split(" ")[1];
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);

        const s0 = await Session.findOne({_id: payload.sub }).populate('user');
        debug("s0 => ", s0);
        if (!s0) throw new jwt.TokenExpiredError("Session not found");
        if (!s0.active) throw new jwt.TokenExpiredError("Session closed");

        req.session = payload;
        req.user = {
            id: s0.user._id,
            username: s0.user.username,
            role: s0.user.role,
        }
        next();
    } // try ...
    catch(e) {
        console.log("verify-token | error =>", e.message);

        let message = "Invalid token";
        let statusCode = 400;
        if (e instanceof jwt.TokenExpiredError) {
            message = e.message;
            statusCode = 401;
        }
        
        res.status(statusCode).send(message);
    } // catch ....
} // module.exports  ...