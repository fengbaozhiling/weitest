/*
* 取窗口到滚动条顶部高度
* */
module.exports.getScrollTop = function () {
    var scrollTop=0;
    if(document.documentElement&&document.documentElement.scrollTop)
    {
        scrollTop=document.documentElement.scrollTop;
    }
    else if(document.body)
    {
        scrollTop=document.body.scrollTop;
    }
    return scrollTop;
}
/*
 * 取窗口可视范围的高度
 * */
module.exports.getClientHeight = function () {
    var clientHeight;
    if(document.body.clientHeight&&document.documentElement.clientHeight)
    {
        clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
    }
    else
    {
        clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
    }
    return clientHeight;
}
/*
* 取文档内容实际高度
* */
module.exports.getScrollHeight = function(){
    return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
}