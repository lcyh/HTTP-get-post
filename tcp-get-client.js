const net = require("net");

const ReadyState = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
};
class XMLHttpRequest {
  constructor() {
    this.readyState = ReadyState.UNSENT; // 默认是未发送
    this.headers = { Connection: "keep-alive" };
  }
  open(method, url) {
    this.method = method || "GET";
    this.url = url;
    //  127.0.0.1   /get   8080
    let { hostname, path, port } = require("url").parse(url);
    this.hostname = hostname;
    this.path = path;
    this.port = port;
    this.headers["Host"] = `${hostname}:${port}`;
    // 开始发送, 通过传输层的net发起一个请求
    const socket = (this.socket = net.createConnection(
      {
        port,
        host: hostname,
      },
      () => {
        // 连接成功后可以监听服务器的数据
        socket.on("data", (data) => {
          debugger;
          data = data.toString();
          //   console.log("data>>>", data);
          // 处理响应了
          /***
            HTTP/1.1 200 OK
            Content-Type: text/plain
            Date: Sat, 26 Sep 2020 01:57:27 GMT
            Connection: keep-alive
            Transfer-Encoding: chunked

            5
            get55
            0
           */
          let [response, bodyRows] = data.split("\r\n\r\n");
          let [statusLine, ...headerRows] = response.split("\r\n");
          let [, status, statusText] = statusLine.split(" ");
          this.status = status;
          this.statusText = statusText;

          this.responseHeaders = headerRows.reduce((memo, rows) => {
            let [key, value] = rows.split(": ");
            memo[key] = value;
            return memo;
          }, {});
          this.readyState = ReadyState.HEADERS_RECEIVED;
          this.onreadystatechange && this.onreadystatechange();
          //   处理响应体
          let [, body] = bodyRows.split("\r\n");
          this.readyState = ReadyState.LOADING;
          this.onreadystatechange && this.onreadystatechange();
          this.response = this.responseText = body;
          this.readyState = ReadyState.DONE;
          this.onreadystatechange && this.onreadystatechange();
          this.onload && this.onload();
        });
      }
    ));
    this.readyState = ReadyState.OPENED;
    this.onreadystatechange && this.onreadystatechange();
  }
  setRequestHeader(header, value) {
    this.headers[header] = value;
  }
  getAllResponseHeaders() {
    let result = "";
    for (let key in this.responseHeaders) {
      result += `${key}:${this.responseHeaders[key]}`;
    }
    return result;
  }
  //   向服务端发数据
  send() {
    // debugger;
    let rows = [];
    rows.push(`${this.method} ${this.url} HTTP/1.1`);
    // this.headers = {name:xiaozhang,age:11}
    // [name,age] => ["name=xiaozhang", "age=11"]
    rows.push(
      ...Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`)
    );
    let request = rows.join("\r\n") + "\r\n\r\n";
    // console.log("request===", request);
    this.socket.write(request);
  }
}

/**
GET /get HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
name: xiaozhang
age: 11

 */

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  console.log("readystatechange", xhr.readyState);
};
xhr.open("GET", "http://127.0.0.1:8080/get");
xhr.setRequestHeader("name", "xiaozhang");
xhr.setRequestHeader("age", "11");
xhr.onload = () => {
  console.log("readyState", xhr.readyState);
  console.log("getAllResponseHeaders", xhr.getAllResponseHeaders());
  console.log("status", xhr.status);
  console.log("statueText", xhr.statusText);
  console.log("response", xhr.response);
};
xhr.send();
