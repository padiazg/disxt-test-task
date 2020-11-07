const http = require("http");
const options = {
  host: "localhost",
  path: "/healthz",
  port: "3000",
  timeout: 2000,
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  process.exit( res.statusCode == 200 ? 0 : 1);
});

req.on("error", e => {
  console.log("ERROR", e.message);
  process.exit(1);
});

req.end();