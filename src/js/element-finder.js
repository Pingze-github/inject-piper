// element-finder 开关版 单函数型

function dragable(ele_id){
    var ele = $('#'+ele_id);
    var clicked = false;
    var mousx = "0";
    var mousy = "0";
    var winx = "0";
    var winy = "0";
    var difx = "0";
    var dify = "0";
    if (ele.css('position')!='absolute'){
        ele.css('position','absolute');
    }
    $("html").mousemove(function (event) {
        mousx = event.pageX;
        mousy = event.pageY;
        winx = ele.offset().left;
        winy = ele.offset().top;
        if (clicked == false) {
            difx = mousx - winx;
            dify = mousy - winy;
        }
        var newx = event.pageX - difx - ele.css("marginLeft").replace('px', '');
        var newy = event.pageY - dify - ele.css("marginTop").replace('px', '');
        ele.css({ top: newy, left: newx });
    });

    ele.mousedown(function (event) {
        clicked = true;
    });
    ele.mouseup(function (event) {
        clicked = false;
    });
}


function switch_register(ele_id){
    var ele = $('#'+ele_id);
    var ele_others = $('*:not(#'+ele_id+')');
    var class_off = 'element-finder-off';
    var class_on = 'element-finder-on';
    var switch_on = false;
    var downpos = [0,0];
    var downing = false;

    ele.mousedown(function(event){
        downpos = [event.pageX,event.pageY];
        downing = true;
    });
    ele.mouseup(function(event){
        var uppos = [event.pageX,event.pageY];
        if (downing){
            if(uppos.toString()==downpos.toString()){//click
                console.log('on')
                ele.css('pointer-events','none');
                ele.removeClass(class_off).addClass(class_on);
                switch_on = true;
                unbindAllUserClickEvents();
                bindClickShow();
            }
            downing = false;
        }
    });
    function unbindAllUserClickEvents(){
        ele_others.each(function(){
            if ($._data($(this)[0],'events')){
                var events_backup_click = $._data($(this)[0],'events').click;
                $(this).data('events_backup_click',events_backup_click);
                delete $._data($(this)[0],'events').click;
            }
        });
    }
    function rebindAllUserClickEvents(){
        ele_others.each(function(){
            if ($(this).data('events_backup_click')){
                var events_backup_click = $(this).data('events_backup_click');
                $._data($(this)[0],'events').click=events_backup_click;
            }
        }); 
    }
    function posOnEle(pos,ele){
        var posx = pos[0];
        var posy = pos[1];
        var ele_top = ele.offset().top;
        var ele_bottom = ele_top + ele.height();
        var ele_left = ele.offset().left;
        var ele_right = ele_left + ele.width();
        if (ele_left<=posx && posx<=ele_right && ele_top<=posy && posy<=ele_bottom){
            return true;
        }else{
            return false;
        }
    }
    function bindClickShow(){
        ele_others.click(function(event){
            event.stopPropagation(); //stop event's propagation
            //event.preventDefault(); //stop default eventHandlers, but not recover itself.
            if (switch_on && $(this)[0]!=ele.parent()[0]){
                pos = [event.pageX,event.pageY];
                if (!posOnEle(pos,ele)){
                    console.log($(this).prop('outerHTML').replace(/\n/g,'').replace(/\s+/g,' ').substr(0,50));

                    selector.select($(this)); //func of element-selector

                }
                ele.css('pointer-events','auto');
                ele.removeClass(class_on).addClass(class_off);
                switch_on = false;
                rebindAllUserClickEvents()
                console.log('off')
                return false; //stop default eventHandlers
            }
        });
    }
    ele.unbind('click');   
}


function create_switch(){
    var ele_id = 'switch'; 
    $('head').append('<link rel="stylesheet" type="text/css" href="/css/element-finder.css"></div>'); //add ele's css
    $('body').prepend('<div id="'+ele_id+'" class="element-finder element-finder-off"></div>'); //add ele
    switch_register(ele_id); //register ele
    dragable(ele_id); //make ele dragable
}
create_switch();
