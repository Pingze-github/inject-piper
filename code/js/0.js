/*.+guaihaha.com.+*/
$(document).ready(function(){
    // 列表
    $('.listPic > a').each(function(){
        var title = $(this).attr('title');
        var a_text = '<a style="width:100%;height:auto;font-size:24px;padding:5px 5px 5px 0;white-space:nowrap;">'+title+'</a>'
        $(this).after(a_text);
    });
    // 内容
    var content = $('.content').html();
    content_new = content.replace(/(<!--)|(-->)/gm,'');
    content_new = content_new.replace(/&lt;--pages--&gt;/gm,'');
    $('.content').html(content_new);
    $('.content img').attr('style','max-width:100%!important;width:100%!important;display:block;');
    $('.content p').eq(-1).css('display','none');
    $('.content img').eq(-1).css('display','none');
});
