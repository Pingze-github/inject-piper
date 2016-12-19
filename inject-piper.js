// inect-piper.js

var SA = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');

charset(SA);

function getResponse(url,callback,charset='utf-8'){
    //get response
    SA.get(url)
    .charset(charset)
    .timeout(5000)
    .end(function(err,res){ //自动重连
        if(err){
            console.log("Failed to get: "+url);
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
                    if(href[6]=="/"){ //from host
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

function inject(url,html){
    //inject code
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
        html = inject(url,html);
        console.log('Piping '+url);
        callback(html);
        console.log('Piped '+url);
    },'utf-8');
}

