define(function (require) {
    var qrcode = require('qrcode');
    var NewCode = function (elemt, option) {
        this.init = function(){
            $(elemt).qrcode(option);
        }
    }
    return NewCode;
})