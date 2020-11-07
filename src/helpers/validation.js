const debug = require("debug")("validation");
const joi = require("joi");

const loginValidation = data => {
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
    }) // schema ...

    return schema.validate(data);
}; // loginValidation ...

const newUserValidation = data => {
    const schema = joi.object({
        username: joi.string()
            .min(6)
            .max(128)
            .required(),
        password: joi.string()
            .min(6)
            .required(),
        name: joi.string()
            .max(256)
            .required(),
        lastname: joi.string()
            .max(256),
        age: joi.number(),
        role: joi.string()
            .required()
            .valid("admin", "client"),
    }) // schema ...    
    return schema.validate(data);
}; // loginValidation ...

const patchUserValidation = data => {
    const schema = joi.alternatives().try({
        password: joi.string().min(6),
        name: joi.string().max(256),
        lastname: joi.string().max(256),
        age: joi.number(),
        role: joi.string().valid("admin", "client"),
    }) // schema ..// 

    return schema.validate(data);
}; // patchUserValidation ...

// PRODUCTS
const newProductValidation = data => {
    const schema = joi.object({
        name: joi.string()
            .max(256)
            .required(),
        description: joi.string()
            .max(2048)
            .required(),            
        price: joi.number(),        
    }) // schema ...    
    return schema.validate(data);
}; // newProductValidation

const patchProductValidation = data => {
    const schema = joi.alternatives().try({
        name: joi.string().max(256),
        description: joi.string().max(2048),            
        price: joi.number(),
    });
    return schema.validate(data);
}; // patchProductValidation ...

module.exports = {
    loginValidation,
    newUserValidation,
    patchUserValidation,
    newProductValidation,
    patchProductValidation
}