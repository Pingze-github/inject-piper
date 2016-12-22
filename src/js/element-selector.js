// element-selector.js

var Selector = function(){
    var ele_select = $(document); //valid init value
    var ele_select_last = $(document);
    var ele_list = [ele_select];
    var ele_level = 0;
    function createSelector(){
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/element-selector.css"></div>'); //add css
        $('body').prepend('<div id="element-selector"><div id ="element-selector-bar"><div id="element-selector-hide">X</div></div><textarea id="element-selector-textarea"></textarea><div id="element-selector-expand">+</div><div id="element-selector-contract">-</div></div>'); //add html
    }
    function showSelector(){
        $('#element-selector').css('display','block');
    }
    function hideSelector(){
        $('#element-selector').css('display','none');
    }
    function refreshSelector(){
        var code = ele_select.prop('outerHTML');
        ele_select.addClass('highlight');
        ele_select_last.removeClass('highlight');
        $('#element-selector-textarea').val(code);
    }
    function resetSelector(ele){
        ele_select_last = ele_select;
        ele_select = ele;
        ele_list = [ele];
        ele_level = 0;
        refreshSelector();
    }
    function selectSelector(ele){
        resetSelector(ele);
        showSelector();
    }
    function registerEvent(){
        $('#element-selector-expand').click(function(){
            if (ele_select && ele_select.parent()[0]!=$(document)[0]){
                ele_select_last = ele_select;
                ele_select = ele_select.parent();
                ele_list.push(ele_select);
                ele_level ++;
                refreshSelector();
            }
        });
        $('#element-selector-contract').click(function(){
            if (ele_select && ele_level>0){
                ele_level --;
                ele_select_last = ele_select;
                ele_select = ele_list[ele_level];
                refreshSelector();
            }
        });
        $('#element-selector-hide').click(function(){
            hideSelector()
        });
    }
    createSelector();
    registerEvent();
    refreshSelector();
    var selector = {
        show : showSelector
        ,hide : hideSelector
        ,reset : resetSelector
        ,select : selectSelector
    }
    return selector;
}

var selector = Selector();
//selector.show();
dragable('element-selector');

