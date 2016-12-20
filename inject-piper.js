// inect-piper.js

var SA = require('superagent');
var charset = require('superagent-charset');
var inject_router = require('./inject-router.js')
charset(SA);

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

function trans_src(html){
    //turn relative src into absolute
    var srcs = html.match(/src=".*?"/gm); 
    for (i in srcs){
        var src = srcs[i];
        //console.log(src); 
        if(src.length>0){
            if(src.indexOf('http')<0){ //relative
                if(src[5]=="/"){ //from host
                    src_abs = src.replace('src="','src="'+host)
                }else{ //from this page
                    src_abs = src.replace('src="','src="'+page)
                }
                html = html.replace(src,src_abs)
            }
        }
    }
    return html
}

function trans_href(html){
    //turn relative href into absolute
    var hrefs = html.match(/href=".*?"/gm);
    for (i in hrefs){
        var href = hrefs[i];
        //console.log(href);
        if(href.length>0){ //not null
            if(href.indexOf('.css')>0 || href.indexOf('.js')>0 || href.indexOf('.svg')>0 || href.indexOf('.ico')>0 || href.indexOf('.jpg')>0 || href.indexOf('.png')>0 || href.indexOf('.gif')>0 || href.indexOf('.bmp')>0){ 
                //not link
                if(href.indexOf('http')<0){ //relative
                    if(href[6]=="/" && href[7]=="/"){ //miss http
                        href_pipe = href.replace('href="','href="http:');
                    }else if(href[6]=="/"){ //from host
                        href_pipe = href.replace('href="','href="'+host);
                    } //impossible from page
                }else{ //absolute
                    href_pipe = href.replace('href="','href="');
                }
            }else{ 
                //link
                if(href.indexOf('http')<0){ //relative
                    if(href[6]=="/" && href[7]=="/"){ //miss http
                        href_pipe = href.replace('href="','href="/pipe?href=http:');
                    }else if(href[6]=="/"){ //from host
                        href_pipe = href.replace('href="','href="/pipe?href='+host);
                    }else{ //from this page
                        href_pipe = href.replace('href="','href="/pipe?href='+page);
                    }
                }else{ //absolute
                    href_pipe = href.replace('href="','href="/pipe?href=');
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
        html = trans_src(html);
        html = trans_href(html);
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

