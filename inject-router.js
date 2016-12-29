// inect-router.js

var fs = require('fs');

var inject_router_json_path = './inject-router.json'

function makeFile(path,string=""){
    fs.access(path,function(err){
        if(err){
            fs.writeFileSync(path,string);
        }
    });
}

exports.inject = function(url,html,callback){
    //inject code
    fs.readFile(inject_router_json_path, 'utf-8', function(err, json){
        if (err){
            throw err;
        }else{
            if (json.length>1){
                var routers = JSON.parse(json);
            }else{
                var routers = {}; //build routers for first use
            }
            for (var i in routers){
                var router = routers[i];
                var pattern = router.pattern;
                if(url.match(pattern)){ //match url
                    var path_css = router.path_css;
                    var path_js = router.path_js;
                    var code_css = fs.readFileSync(path_css);
                    code_css = '<style class="inject-css" type="text/css">'+code_css+'</style>';
                    var code_js = fs.readFileSync(path_js);
                    code_js = '<script type="text/javascript" src="/js/jquery.min.js"></script><script type="text/javascript">'+code_js+'</script>';
                    html = html.replace('</head>',code_css+'</head>'); //inject css code
                    html = html.replace('</body>',code_js+'</body>'); //inject js code
                }
            }
            callback(html); //callback
        }
    });
}

exports.addRouter = function(pattern){
    var inRouters = function(pattern,routers){
        for (var i in routers){
            var router = routers[i];
            var pattern_in = router.pattern;
            if (pattern_in==pattern){
                return i;
            }
        }
        return (-1);
    }
    fs.readFile(inject_router_json_path, 'utf-8', function(err, json){
        if (err){
            throw err;
        }else{
            if (json.length>2){ //not null
                var routers = JSON.parse(json);
            }else{ //null
                var routers = []; //build routers for first use
            }
            var index = inRouters(pattern,routers);
            if (index>-1){ //already in
                var id = routers[index].id;
                console.log('Router already in: // pattern: '+pattern+' // pid: '+id);
            }else{ //not in
                var router = {};
                var id = routers.length;
                var path_css = './code/css/'+id+'.css';
                var path_js = './code/js/'+id+'.js';
                makeFile(path_css,"/*"+pattern+"*/");
                makeFile(path_js,"/*"+pattern+"*/");
                router.pattern = pattern;
                router.id = id;
                router.path_css = path_css;
                router.path_js = path_js;
                console.log(router);
                routers.push(router);
                json = JSON.stringify(routers)
                console.log(json);
                fs.writeFile(inject_router_json_path, json, 'utf-8', function(err){
                    if (err){
                        throw err;
                    }else{
                        console.log('Add router '+pattern+' : '+id+' success');
                    }
                });
            }
        }
    });
}


/*exports.addRouter('.+guaihaha.com.+');
exports.addRouter('.+m.23wx.com.+');*/


/*exports.addRouter = function(pattern,code){
    var inRouters = function(pattern,routers){
        for (var i in routers){
            var router = routers[i];
            var pattern_in = router.pattern;
            if (pattern_in==pattern){
                return i;
            }
        }
        return (-1);
    }
    fs.readFile(inject_router_json_path, 'utf-8', function(err, json){
        if (err){
            throw err;
        }else{
            if (json.length>2){
                var routers = JSON.parse(json);
            }else{
                var routers = []; //build routers for first use
            }
            var index = inRouters(pattern,routers);
            if (index>-1){ //already in
                console.log('router already in');
                routers[index].code = code;
                json = JSON.stringify(routers)
                console.log(json);
                fs.writeFile(inject_router_json_path, json, 'utf-8', function(err){
                    if (err){
                        throw err;
                    }else{
                        console.log('Change router '+pattern+' success');
                    }
                });
            }else{
                var router = {};
                router.pattern = pattern;
                router.code = code;
                console.log(router);
                routers.push(router);
                json = JSON.stringify(routers)
                console.log(json);
                fs.writeFile(inject_router_json_path, json, 'utf-8', function(err){
                    if (err){
                        throw err;
                    }else{
                        console.log('Add router '+pattern+' success');
                    }
                });
            }
        }
    });
}*/



