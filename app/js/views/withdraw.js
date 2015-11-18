var doT = require('../../lib/dot/dot');
var dialog = require('../component/dialog/dialog');
var api = require('../api');
var cash = require('../models/cash');
var tpl = require('html!../tpl/withdraw.html');

module.exports = Backbone.View.extend({
    el: $('#withdrawView'),
    template: doT.template(tpl),
    tagName: 'div',
    events: {
        'click #withdrawWay':function(){
            var d = new dialog({
                content: '暂时无其他提现方式',
                title: false,
                time: false,
                ok: function(){
                    d.close();
                }
            });
        },
        'click .za-btn':'_withdraw'
    },
    _withdraw: function(){
        var _this = this;
        var form = _this.$el.find('form'),
            num = parseInt(form.find('[name="cash"]').val());

        if (_this._validateCash(num)){
            $.ajax({
                url:api.withdraw,
                method:'POST',
                data:form.serialize,
                success:function(data){
                    var d = new dialog({
                        content: data.message,
                        title: false,
                        time: false,
                        maskClose:false,
                        ok: function(){
                            d.close();
                            window.location = '#withdraw_list'
                        }
                    });
                }
            })
        };
    },
    _validateCash:function(num){
        var _this = this;
        var reg = /^[1-9]\d*$/,
            integral = _this.cashModel.get('integral'),
            canwidraw =  Math.floor(integral/100);
        if ( num == '') {
            alert('请填写金额')
            return false;
        } else if (!reg.test(num)) {
            alert('请填写正整数')
            return false;
        } else if (num > canwidraw) {
            alert('您的余额不足')
            return false;
        } else if (num > 200) {
            alert('单次只能提现200元')
            return false;
        }
        return true;
    },
    initialize: function () {
        var _this = this;
        _this.cashModel = new cash;
        _this.listenTo(_this.cashModel, 'sync', this.render);
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template(_this.cashModel.toJSON()));
        return this;
    }
});