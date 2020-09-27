let net = require("net");
// 创建一个tcp服务器，每当有客户端来连接了就会为它创建一个socket
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    debugger;
    //console.log("服务端收到的data", data);
    // 解析请求
    let request = data.toString();
    let [requestLine, ...headerRows] = request.split("\r\n");
    let [method, path] = requestLine.split(" ");
    let headers = headerRows.slice(0, -2).reduce((memo, row) => {
      let [key, value] = row.split(": ");
      memo[key] = value;
      return memo;
    }, {});
    console.log("method", method);
    console.log("path", path);
    console.log("headers", headers);
    // 构建响应体
    let rows = [];
    rows.push(`HTTP/1.1 200 OK`);
    rows.push(`Content-Type: text/plain`);
    rows.push(`Connection: keep-alive`);
    let body = "get55";
    let bodylen = Buffer.byteLength(body);
    rows.push(`Content-Length: ${bodylen}`);
    rows.push(`Date:${new Date().toGMTString()}`);
    rows.push(`\r\n${Buffer.byteLength(body).toString(16)}\r\n${body}\r\n0`);
    let response = rows.join("\r\n");
    console.log("response====", response);
    socket.end(response);
  });
});
server.listen(8080);
/**
 * 响应头：
 *  HTTP/1.1 200 OK
    Content-Type: text/plain
    Date: Sat, 26 Sep 2020 01:40:37 GMT
    Connection: keep-alive
    Content-Length: 5
 */

/**
 * 请求头：
 * GET /get HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
name: xiaozhang
age: 11

 */
