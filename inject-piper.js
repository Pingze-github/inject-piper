// inect-piper.js

var SA = require('superagent');
var charset = require('superagent-charset');
charset(SA);
var inject_router = require('./inject-router.js')

function getResponse(url,callback,retry_time=0){
    //get response
    var retry_max_time = 2; //max retry times
    var timeout = 5000; //request timeout
    SA.get(url)
    .timeout(timeout)
    .charset() //auto check
    .end(function(err,res){
        if(err){
            retry_time ++;
            if (retry_time>retry_max_time){
                console.log("Failed at last, sending refresh.html")
            }else{
                console.log("Failed to get: "+url+',retring '+retry_time.toString()+' time ...');
                getResponse(url,callback,retry_time);
            }
        }else{
            callback(res);
        }
    })
}

function information(html){
    //add information
    html = html.replace('<title>','<title>'+'Inject-piper - ')
    return html
}

function unifyQuotation(html){
    var hrefs_sin = html.match(/href='.*?'/gm);
    for (var i in hrefs_sin){
        var href_sin = hrefs_sin[i];
        var href_dou = href_sin.substr();
        href_dou = href_dou.replace(/"/g,'%%dou%%');
        href_dou = href_dou.replace(/'/g,'"');
        href_dou = href_dou.replace(/%%dou%%/g,"'");
        html = html.replace(href_sin,href_dou);
    }
    var srcs_sin = html.match(/src='.*?'/gm);
    for (var i in srcs_sin){
        var src_sin = srcs_sin[i];
        var src_dou = src_sin.substr();
        src_dou = src_dou.replace(/"/g,'%%dou%%');
        src_dou = src_dou.replace(/'/g,'"');
        src_dou = src_dou.replace(/%%dou%%/g,"'");
        html = html.replace(src_sin,src_dou);
    }
    return html;
}

function trans_src(html){
    //turn relative src into absolute
    var srcs = html.match(/src=".*?"/gm); 
    for (var i in srcs){
        var src = srcs[i];
        //console.log(src);
        if(src.length>0){ //not null
            if(src.indexOf('http')<0){ //relative
                if(src[5]=="/" && src[6]=="/"){ //miss http
                    var src_pipe = src.replace('src="','src="http:');
                }else if(src[5]=="/"){ //from host
                    var src_pipe = src.replace('src="','src="'+host);
                } //impossible from page
            }else{ //absolute
                var src_pipe = src;
            }
            html = html.replace(src,src_pipe)
        }
    }
    return html
}

function trans_href(html){
    //turn relative href into absolute
    var hrefs = html.match(/href=".*?"/gm);
    for (var i in hrefs){
        var href = hrefs[i];
        //console.log(href);
        if(href.length>0){ //not null
            if(href.indexOf('.css')>0 || href.indexOf('.js')>0 || href.indexOf('.svg')>0 || href.indexOf('.ico')>0 || href.indexOf('.jpg')>0 || href.indexOf('.png')>0 || href.indexOf('.gif')>0 || href.indexOf('.bmp')>0){ 
                //not link
                if(href.indexOf('http')<0){ //relative
                    if(href[6]=="/" && href[7]=="/"){ //miss http
                        var href_pipe = href.replace('href="','href="http:');
                    }else if(href[6]=="/"){ //from host
                        var href_pipe = href.replace('href="','href="'+host);
                    } //impossible from page
                }else{ //absolute
                    var href_pipe = href;
                }
            }else{ 
                //link
                if(href.indexOf('http')<0){ //relative
                    if(href[6]=="/" && href[7]=="/"){ //miss http
                        var href_pipe = href.replace('href="','href="/piper?href=http:');
                    }else if(href[6]=="/"){ //from host
                        var href_pipe = href.replace('href="','href="/piper?href='+host);
                    }else{ //from this page
                        var href_pipe = href.replace('href="','href="/piper?href='+page);
                    }
                }else{ //absolute
                    var href_pipe = href.replace('href="','href="/piper?href=');
                }
            }
            //console.log(href_pipe);
            html = html.replace(href,href_pipe)
        }
    }
    return html
}


exports.pipe = function(url,callback){
    var html = "<body>inect-pipe</body>";
    console.log('Getting '+url);
    var urlp = url.split('/');
    host = urlp[0]+'/'+urlp[1]+'/'+urlp[2]; //global
    page = url.substr(0,url.lastIndexOf('/'))+'/';
    getResponse(url,function(res){
        console.log('Got '+url);
        var html = res.text; //original html
        html = information(html); //add information
        html = unifyQuotation(html); //turn '' to ""
        html = trans_src(html); //transform src
        html = trans_href(html); //transform href
        //html = html.replace('</body>','<script type="text/javascript" src="/js/jquery.min.js"></script><script type="text/javascript" src="/js/element-finder.js"></script><script type="text/javascript" src="/js/element-selector.js"></script></body>') //inject element-finder
        inject_router.inject(url,html,function(html_injected){
            console.log('Piping '+url);
            callback(html_injected);
            console.log('Piped '+url);
        });
    });
}

/*url = 'http://m.23wx.com/html/55/55519/22639855.html'
//url = 'http://book.qidian.com/info/1004608738'
getResponse(url,function(res){
    console.log('Got '+url);
    var html = res.text; //original html
});*/

/*
1.css中的图片未转换。
2.js运行后生成的相对url不能转换。
3.https资源错误
4.单引号情况
*/
