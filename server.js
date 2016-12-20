// server.js

/**IMPORT**/
var express = require('express');
var url = require('url');
var inject_piper = require('./inject-piper.js');

/** SET **/
var app = express();
app.use(express.static('./src')); //add src files

/**FUNCTION**/
function sendViewMiddleware(req, res, next) { //send .html
    res.sendHtml = function(html) {
        return res.sendFile(__dirname + "/" + html);
    }
    next();
}
app.use(sendViewMiddleware);

/**GET**/
app.get('/', function (req, res) { //主页
    console.log("[SERVER][GET] /");
    res.sendHtml('index.html');
});

app.get('/piper', function (req, res) { //pipe
    console.log("[SERVER][GET] /piper");
    var params = url.parse(req.url,true).query;
    if (params['href']){
        console.log(params);
        var href = params['href'];
        inject_piper.pipe(href,function(html){
            res.send(html);
        });
    }else{
        res.sendHtml('index.html');
    }
});

/**启动服务器**/
var server = app.listen(10000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Sever Start @ http://%s:%s", host, port)
}); //于指定端口启动服务器



