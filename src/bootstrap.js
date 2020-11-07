const dotenv = require('dotenv');
dotenv.config();

const mongoose = require("mongoose");
const User = require("./model/user");
const Product = require("./model/product");
const Session = require("./model/session");
const hash = require("./helpers/hash");

(async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: { authSource: process.env.DB_AUTHSOURCE },
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
        });
        console.log('Bootstrap | Connected to DB...');
        
        console.log('Bootstrap | Drop all existing users');
        const r0 = await User.deleteMany({});
        console.log("Bootstrap | Clear users =>", r0);
        
        console.log('Bootstrap | Create admin user');
        const adminUser = new User({
            username: "administrator",
            password: await hash(process.env.PASSWORD),
            name: "Administrator",
            lastname: "",
            age: 0,
            role: "admin",
        });

        const r1 = await adminUser.save();
        console.log("Bootstrap | Admin user created =>", !!r1);

        console.log('Bootstrap | Delete all sessions');
        const r2 = await Session.deleteMany({});
        console.log("Bootstrap | Clear sessions =>", r2);


        console.log('Bootstrap | Drop all existing products');
        const r3 = await Product.deleteMany({});
        console.log("Bootstrap | Clear products =>", r3);

        mongoose.disconnect();
    } // try ...
    catch (e) {
        console.error('Bootstrap | Connecting to DB:', e);
        process.exit(-1);
    }
})()