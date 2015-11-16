define(function(){
    var BiuTip = function(options) {
        this.option = {
            box:'body',
            class:'tips-biu',
            content:'哈哈！',
            time:1000,
            css:null
        };
        this.option = $.extend(this.option, options);
        this.el = $('<div >');
        this.el.addClass(this.option.class);
        this.el.html(this.option.content);
        this.el.css(this.option.css);
        this.init().timeOut();
    };
    BiuTip.prototype.timeOut = function() {
        var _this = this;
        setTimeout(function(){
            _this.el.remove();
        },_this.option.time)
    };
    BiuTip.prototype.init = function() {
        $(this.option.box).append(this.el)
        return this;
    };
    return BiuTip;
});