;define(['dialog'],function(dialog){
    var tips = function(title, msg, time) {
        var d = new dialog({
            content: msg,
            title: title,
            close: true,
            ok: {
                value: '确定',
                fn: function () {
                    d.close();
                }
            },
            cancel: {
                value: '取消',
                fn: function () {
                    d.close();
                }
            }
        });
        if (time) {
            setTimeout(function(){
                d.close();
            },time)
        }
    };
    return tips;
});