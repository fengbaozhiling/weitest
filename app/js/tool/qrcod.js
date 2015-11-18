var qrcode = require('../../lib/qrcode/jquery.qrcode');
module.exports = function (elemt, option) {
    this.init = function(){
        $(elemt).qrcode(option);
    }
}