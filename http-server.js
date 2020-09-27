let http = require("http");
let fs = require("fs");
const path = require("path");
let url = require("url");

let server = http.createServer((req, res) => {
  let { pathname } = url.parse(req.url);
  if (["/get.html"].includes(pathname)) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    // 以同步模式读取文件内容
    let content = fs.readFileSync(path.join(__dirname, "static", "get.html"));
    res.end(content);
  } else if (pathname === "/get") {
    console.log("methods", req.method);
    console.log("headers", req.headers);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("get55");
    // res.write("get55");
    // res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});
let port = 3001;
server.listen(port, () => {
  console.log("服务启动了", port);
});
