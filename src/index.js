const dotenv = require('dotenv');
const express = require("express");
const app = express();
const mongoose = require("mongoose");

dotenv.config();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const healthzRoute = require("./routes/healthz");
const verify = require("./helpers/verify-token");

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/user', verify, userRoute);
app.use('/api/product', verify, productRoute);
app.use('/healthz', healthzRoute);

const PORT = 3000;

(async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: { authSource: process.env.DB_AUTHSOURCE },
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
        });
        console.log('Connected to DB...');

        const httpServer = app.listen({ port: PORT}, () => {
            console.log(`🚀 Server ready at http://${httpServer.address().address}:${httpServer.address().port}`);
        }) // httpServer ...

    }
    catch (e) {
        console.error('Connecting to DB:', e);
        process.exit(-1);
    }
})()

//=============================================================================
//             Clean exit handlers
//=============================================================================
process.stdin.resume(); //so the program will not close instantly

const exitHandler = (options, exitCode) => {
    if (options.cleanup) {
        mongoose.disconnect();
        console.log("Cleaned up");
    } // if (options.cleanup) ...

    if (exitCode || exitCode === 0) {
        console.log("Exit code:", exitCode);
    }

    if (options.exit) process.exit();
} // exitHandler ...

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));