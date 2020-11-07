const bcrypt = require("bcryptjs");

module.exports = async plain => await bcrypt.hash(plain, await bcrypt.genSalt(10));