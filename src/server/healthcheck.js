// Used by the Docker healthcheck: node:23-slim has no curl/wget, so this
// hits GET /health with the built-in http module and exits 0/1 accordingly.
const http = require("http");

const req = http.get("http://localhost:5000/health", (res) => {
    process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on("error", () => process.exit(1));
req.setTimeout(3000, () => {
    req.destroy();
    process.exit(1);
});
