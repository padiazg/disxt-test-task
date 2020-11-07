const debug = require("debug")("acl");

const accessMap = new Map([
    ["product-list", "*"],
    ["product-detail", "*"],
    ["product-create", "admin"],
    ["product-update", "admin"],
    ["product-delete", "admin"],
    ["product-createdby", "admin"],
    ["user-list", "admin"],
    ["user-detail", "admin"],
    ["user-create", "admin"],
    ["user-update", "admin"],
    ["user-delete", "admin"],
]); // accessMap ...

// helper
const allowed = (action, role) => {
    const a0 = accessMap.get(action);
    debug(`allowed | action: ${action} | required: ${a0} | role: ${role}`);
    return a0 == role || a0 == "*";
} // allowed ...

// middleware
const acl = action => (req, res, next) => {
    const a0 = accessMap.get(action);
    debug(`acl | action: ${action} | required: ${a0} | role: ${req.user.role}`);
    if (a0 == req.user.role || a0 == "*") {
        next();
    }
    else {
        res.status(403).send("Forbidden");
    }
} // acl

module.exports = {
    allowed,
    acl
};