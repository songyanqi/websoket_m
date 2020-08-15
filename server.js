// https://www.cnblogs.com/limitcode/p/7850913.html
var http=require("http");
var express=require("express");//引入express
var socketIo=require("socket.io");//引入socket.io
var app=new express();
var server=http.createServer(app);
var io=new socketIo(server);//将socket.io注入express模块
app.get("/demo",function (indexreq,res,next) {
    res.sendFile(__dirname+"/dist/demo.html");
});
//客户端 1 的访问地址
app.get("/index",function (indexreq,res,next) {
    res.sendFile(__dirname+"/dist/index.html");
});
//客户端 2 的访问地址
app.get("/index1",function (req,res,next) {
    res.sendFile(__dirname+"/dist/index1.html");
});
server.listen(8080, '192.168.1.155',function func(err){
    if (err) {
        console.log(err)
    } else {
        console.log('http://192.168.1.155:8080/index')
    }
});//express 监听 8080 端口，因为本机80端口已被暂用
//每个客户端socket连接时都会触发 connection 事件
io.on("connection",function (socket) {
    // socket.io 使用 emit(eventname,data) 发送消息，使用on(eventname,callback)监听消息
    // 监听客户端发送的 sendMsg 事件
    socket.on("sendMsg",function (data) {
        // data 为客户端发送的消息，可以是 字符串，json对象或buffer
        // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
        socket.broadcast.emit("receiveMsg",data);
    })
    //demo
    socket.on('sendScrollTop',function(data){
        console.log(data,'server')
        socket.broadcast.emit('resData', data)
        socket.emit('resData', data);
    })
});