const debug = require("debug")("user");
const router = require("express").Router();
const mongoose = require("mongoose");

const { allowed, acl } = require("../helpers/acl");
const { ForbiddenError } = require("../helpers/errors");
const { newUserValidation, patchUserValidation } = require("../helpers/validation");
const hash = require("../helpers/hash");

const User = require("../model/user");

router.get('/byusername/:username', acl("user-detail"), async (req, res) => {
    try {
        if (!req.params.username) return res.status(400).send("Missing username");
        const r0 = await User.find({username: req.params.username}).select({password: 0});
        res.status(200).json(r0);
    } // try ...
    catch(e) {
        console.log("user/get/byusername | error =>", e);
        res.status(500).send(e.message);
    } // catch ..
}); 

router.get('/:id?', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) {
            if (!allowed("user-detail", req.user.role)) throw new ForbiddenError("Forbidden");
            filter._id = mongoose.Types.ObjectId(req.params.id);
        }
        else {
            if (!allowed("user-list", req.user.role)) throw new ForbiddenError("Forbidden");
        }
        const r0 = await User.find(filter).select({__v: 0, password: 0});
        res.status(200).json(r0);
    } // try ...
    catch(e) {
        console.log("user/get | error =>", e);
        const statusCode = e instanceof ForbiddenError ? 403 : 500;
        res.status(statusCode).send(e.message);
    } // catch ...
}); 

// Create
router.post("/", acl("user-create"), async (req, res) => {
    try {

        // let's check the username doesn't already exists
        const u0 = await User.findOne({ username: req.body.username});
        if (u0) return res.status(400).send(`Username ${req.body.username} already exists`);

        // let's validate the data received
        const { error } = newUserValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);
        
        // let's create a new user
        const user = new User({
            username: req.body.username,
            password: await hash(req.body.password),
            name: req.body.name,
            lastname: req.body.lastname,
            age: req.body.age,
            role: req.body.role,
        });

        const u1 = await user.save();
        return res.status(201).json(u1);
    }
    catch(e) {
        console.log("user/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

// full update
router.put("/:id", acl("user-update"), async (req, res) => {
    try {
        const filter = {_id: mongoose.Types.ObjectId(req.params.id)};
        // let's check the user exists
        const u0 = await User.findOne(filter);
        if (!u0) return res.status(404).send(`User not found`);

        // let's validate the data received
        const { error } = newUserValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);

        // let's update the user
        const r0 = await User.updateOne(filter, {
            username: req.body.username,
            password: await hash(req.body.password),
            name: req.body.name,
            lastname: req.body.lastname,
            age: req.body.age,
            role: req.body.role,
        }); // updateOne ...

        res.status(r0.nModified ? 200 : 204).end();
    } // try ...
    catch(e) {
        console.log("user/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

// partial update 
router.patch("/:id", acl("user-update"), async (req, res) => {
    try {
        const filter = {_id: mongoose.Types.ObjectId(req.params.id)};
        // let's check the username exists
        const u0 = await User.findOne(filter);
        if (!u0) return res.status(404).send(`User not found`);

        // let's validate the data received
        const { error } = patchUserValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);
        
        // prepare data for database
        const data = { ...req.body };
        // if there is a password amongst the data to update
        if (data.password) data.password = await hash(req.body.password)

        // update the user
        const r0 = await User.updateOne(filter, data);

        res.status(r0.nModified ? 200 : 204).end();
    } // try ...
    catch(e) {
        console.log("user/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

// Delete
router.delete("/:id", acl("user-delete"), async (req, res) => {
    try {
        await User.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
        res.status(200).end();
    } // try ...
    catch(e) {
        console.log("user/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

module.exports = router;
