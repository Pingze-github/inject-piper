// inect-router.js

var fs = require('fs');

var inject_router_json_path = './inject-router.json'

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
                var code = router.code;
                if(url.match(pattern)){ //match url
                    html = html.replace('</head>',code+'</head>'); //inject code
                }
            }
            callback(html); //callback
        }
    });
}

exports.addRouter = function(pattern,code){
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

}


/*code = '<style class="inject-css" type="text/css">uuu,div[id^="_UU"],script[src="http://m.tianyanzs.com/3"] + div{display:none !important;height:0 !important}</style>'
exports.addRouter('.+m.23wx.com.+',code);*/
