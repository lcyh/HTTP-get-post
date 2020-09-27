**1.TCP/IP 参考模型**

tcp 协议传输信息，http 协议解析信息

https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState

http://nodejs.cn/api/net.html#net_net_createconnection_options_connectlistener

**2.GET**
GET 方法意思是获取被请求 URI（Request-URI）指定的信息（以实体的格式）

<img src='https://image-c.weimobwmc.com/wrz/cd26bf76d97f4798914cdbae7337ddae.png'>

2.1.1 http-server

```
const http = require(“http”);
const fs = require(“fs”);
const url = require(“url”);
const path = require(“path”);
const server = http.createServer((req, res) => {
const { pathname } = url.parse(req.url);
if (pathname === “/get.html”) {
    console.log(“进来了~~~”);
    res.statusCode = 200;
    res.setHeader(“Content-Type”, “text/html”);
    const html = fs.readFileSync(path.join(__dirname, “static”, “get.html”));
    res.end(html);
} else if (pathname === “/get”) {
    res.statusCode = 200;
    res.setHeader(“Content-Type”, “text/plain”);
    res.end(“get”);
} else {
    res.statusCode = 404;
    res.end();
}
});
server.listen(8080, () => {
console.log(“server is running at port 8080”);
});
```

**2.1.2 static/get.html**

**2.2 请求响应格式**

**2.2.1 请求**
一个请求消息是从客户端到服务器端的，在消息首行里包含方法，资源指示符，协议版本。

<img src='https://image-c.weimobwmc.com/wrz/a67f36dbbed94bc8a99ea02c16e34e41.png'>

```
Request = Request-Line ; Section 5.1 \*（（ general-header ; Section 4.5
| request-header ; Section 5.3
| entity-header ） CRLF） ; Section 7.1
CRLF
[ message-body ] ; Section 4.3

GET /get HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
name: zhangsan
age: 11
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36
Accept: /
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,und;q=0.8,en;q=0.7
```

**2.2.2 响应**
接收和解析一个请求消息后，服务器发出一个 HTTP 响应消息。

```
response ＝ Status-Line ; \*（（ general-header） ;
| response-header ;
| entity-header）CRLF） ;
CRLF
[ message-body ] ;

HTTP/1.1 200 OK
Context-type: text-plain
Date: Sat, 26 Sep 2020 12:52:29 GMT
Connection: keep-alive
Transfer-Encoding: chunked
5
get55
0
```
