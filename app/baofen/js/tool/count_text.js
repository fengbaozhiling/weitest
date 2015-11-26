/*
 * 获取验证码的倒计时的封装，依赖count模块，或许这个可以抽离出去，不用放到common里
 * var verifyDown =  $(id);
 common.countDown (verifyDown, 59);
 * */
var count = require('../../../component/countdown/countdown');
module.exports =  function (obj, time, cb) {
    count.countDownFormat(time, function (data) {
        var str = '';
        if (data) {
            obj.attr('disabled', 'disabled');
            str = data + '后刷新';
            obj.html(str);
        } else {
            obj.html('<a><i class="iconfont icon-shuaxin"></i></a>').removeAttr('disabled');
            if (cb) cb(obj);
        }
    });
};
