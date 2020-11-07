const debug = require("debug")("auth");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { loginValidation } = require("../helpers/validation");
const verify = require("../helpers/verify-token");
const User = require("../model/user");
const Session = require("../model/session");

router.post('/login', async (req, res) => {    
    try {
        // lets validate the data received
        const { error } = loginValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);
    
        // check if user exists
        const user = await User.findOne({ username: req.body.username});
        if (!user) return res.status(401).send("User doesn't exists");
    
        // check if password is correct
        const passwordValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordValid) return res.status(401).send("Invalid password");
        
        const session = new Session({ user: user._id });
        const s0 = await session.save();
    
        const token = jwt.sign({
            sub: s0._id,
            exp: s0.exp,
            iat: s0.iat
        }, process.env.TOKEN_SECRET);

        res.status(201).send(token);
    } // try ...
    catch(e) {
        console.log("login | error =>", e);
        return res.status(500).send(e);
    }
}); // login ...

router.post('/logout', verify, async (req, res) => {
    try {
        const r0 = await Session.updateOne({_id: req.session.sub }, { active: false });
        debug("logout | r0 =>", r0);
        res.status(200).send("logged out");
    }
    catch(e) {
        console.log("logout | error =>", e);
        res.status(500).send(e.message);
    }
}); // logout ...

router.get('/me', verify, async (req, res) => { 
    debug("me | session =>", req.session);    
    res.status(200).json(req.user);
}); // me ...

module.exports = router;