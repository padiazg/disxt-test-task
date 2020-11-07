const debug = require("debug")("product");
const router = require("express").Router();
const mongoose = require("mongoose");

const { allowed, acl } = require("../helpers/acl");
const { ForbiddenError } = require("../helpers/errors");
const { newProductValidation, patchProductValidation } = require("../helpers/validation");

const Product = require("../model/product");

router.get('/:id?', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) {
            if (!allowed("product-detail", req.user.role)) throw new ForbiddenError("Forbidden");
            filter._id = mongoose.Types.ObjectId(req.params.id);
        }
        else {
            if (!allowed("product-list", req.user.role)) throw new ForbiddenError("Forbidden");
        }

        // show created_by only to allowed rol
        const select = { __v: 0};
        if (!allowed("product-createdby", req.user.role)) {
            select["created_by"] = 0
        }

        const r0 = await Product.find(filter).select(select); //.populate('created_by');

        res.status(200).json(r0);
    } // try ...
    catch(e) {
        console.log("product/get | error =>", e);
        const statusCode = e instanceof ForbiddenError ? 403 : 500;
        res.status(statusCode).send(e.message);
    } // catch ...
}); 

// Create
router.post("/", acl("product-create"), async (req, res) => {
    try {

        // let's check there isn't an existing product with the same name
        const u0 = await Product.findOne({ name: req.body.name});
        if (u0) return res.status(400).send(`Product ${req.body.username} already exists`);

        // let's validate the data received
        const { error } = newProductValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);
        
        // let's create a new user
        const product = new Product({
            ...req.body,
            created_by: req.user.id,
        }); // new Product ...

        const u1 = await product.save();
        return res.status(201).json(u1);
    }
    catch(e) {
        console.log("product/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

// full update
router.put("/:id", acl("product-update"), async (req, res) => {
    try {
        const filter = {_id: mongoose.Types.ObjectId(req.params.id)};
        
        // let's check the product exists
        const u0 = await Product.findOne(filter);
        if (!u0) return res.status(404).send(`Product not found`);

        // let's validate the data received
        const { error } = newProductValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);

        // let's update the user
        const r0 = await Product.updateOne(filter, req.body);

        res.status(r0.nModified ? 200 : 204).end();
    } // try ...
    catch(e) {
        console.log("product/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

// partial update
router.patch("/:id", acl("product-update"), async (req, res) => {
    try {
        const filter = {_id: mongoose.Types.ObjectId(req.params.id)};
        
        // let's check the product exists
        const u0 = await Product.findOne(filter);
        if (!u0) return res.status(404).send(`Product not found`);

        // let's validate the data received
        const { error } = patchProductValidation(req.body);        
        if (error) return res.status(400).send(error.details[0].message);

        // let's update the user
        const r0 = await Product.updateOne(filter, req.body);

        res.status(r0.nModified ? 200 : 204).end();
    } // try ...
    catch(e) {
        console.log("product/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

// Delete
router.delete("/:id", acl("product-delete"), async (req, res) => {
    try {
        await Product.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
        res.status(200).end();
    } // try ...
    catch(e) {
        console.log("product/get | error =>", e);
        res.status(500).send(e.message);
    } // catch ...
});

module.exports = router;