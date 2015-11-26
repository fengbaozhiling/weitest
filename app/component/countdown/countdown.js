/**
 *倒计时
 *zhongliangwenwx@163.com
 * count.down(11120,function(timerObj){
 * count.formatTime(time, callback)
 })
 */
var count = {};
var ms = 1;
var count_timer;
count.down = function(time, callback){
    var d, h, m, s, seconds = time,
        callback = callback || function(){};
    var str_d="",
        str_h="",
        str_m="",
        str_s="",
        str_ms='.'+ms,
        str="",
        return_data = false;
    if (seconds > 0) {
        return_data = {
            d: parseInt(seconds / 24 / 3600),
            h: parseInt((seconds / 3600) % 24),
            m: parseInt((seconds / 60) % 60),
            s: parseInt(seconds % 60),
            ms:str_ms
        };
        if(ms==0){
            seconds = seconds-1;
        }
        clearTimeout(count_timer);
        count_timer = null;
        count_timer = setTimeout(function(){
            count.down(seconds,callback);
            ms--;
            ms = ms < 0 ? 1 : ms;
        },500);
    }
    callback(return_data);
};

count.formatTime = function (timeObj) {
    if (timeObj) {
        var str = '',
            d = timeObj.d ? timeObj.d : 0,
            h = timeObj.h ? timeObj.h : 0,
            m = timeObj.m ? timeObj.m : 0,
            s = timeObj.s ? timeObj.s : 0;

        m = m<10 ? '0'+m : m;
        s = s<10 ? '0'+s : s;

        str += ( d == '0') ?  '' :  ( d + '天');
        str += ( h == '0') ?  '' :  ( h + '时');
        str += ( m == '00') ?  '' :  ( m + '分');
        str += s + ' 秒';
        return str;
    }
    return timeObj;

};

count.countDownFormat = function (time, callback) {
    count.down(time,function(timeObj){
        var data = count.formatTime (timeObj);
        callback (data)
    })
};

module.exports = count;