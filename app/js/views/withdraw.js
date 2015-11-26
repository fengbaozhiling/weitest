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
        'click #withdrawWay': function () {
            var d = new dialog({
                content: '暂时无其他提现方式',
                title: false,
                time: false,
                ok: function () {
                    d.close();
                }
            });
        },
        'click .za-btn': '_withdraw',
        'change input[name="cash"]':'_subInput',
        'keyup input[name="cash"]':'_subInput'
    },
    _isFirst: true,
    _subInput:function(e){
        var _this = this;
        var num = _this.cashModel.get('num');
        var numBox = _this.$el.find('.num');
        var type = _this.cashModel.get('type');
        var val = $(e.target).val();
        /*
         * 根据type的不同，进入不同的验证
         * */
        if (val!='') {
            if (type == 1 && !_this._validateIntegral(val)) {
                return;
            } else if (type == 2 && !_this._validateMoney(val)) {
                return;
            }
        }
        if (type == 1) {
            numBox.html(num-val*100);
        } else if (type == 2) {
            numBox.html(num-val);
        }
    },
    _withdraw: function (e) {
        var _this = this;
        var type = _this.cashModel.get('type');
        var form = _this.$el.find('form'),
            num = parseInt(form.find('[name="cash"]').val());
        /*
        * 根据type的不同，进入不同的验证
        * */
        if (type == 1 && !_this._validateIntegral(num)) {
            return;
        } else if (type == 2 && !_this._validateMoney(num)) {
            return;
        }
        /*
        * _this._isFirst是否第一次提交
        * */
        if (_this._isFirst) {
            $(e.target).html('正在申请...').addClass('disabled');
            _this._isFirst = false;
            $.ajax({
                url: api.withdraw,
                method: 'POST',
                data: form.serialize(),
                success: function (data) {
                    _this._isFirst = true;
                    if (data.status) {
                        var d = new dialog({
                            content: data.info,
                            title: false,
                            time: false,
                            maskClose: false,
                            ok: function () {
                                d.close();
                                window.location = '#withdraw_list'
                            }
                        });
                    } else {
                        $(e.target).html('申请提现').removeClass('disabled');
                        alert(data.info)
                    }
                }
            })
        }
    },
    _validateIntegral: function (num) {
        /*
        * 积分验证
        * */
        var _this = this;
        var reg = /^[1-9]\d*$/,
            numtotal = _this.cashModel.get('num'),
            canwithdraw = Math.floor(numtotal / 100);
        if (num == '') {
            alert('请填写金额')
            return false;
        } else if (!reg.test(num)) {
            alert('请填写正整数')
            return false;
        } else if (num > canwithdraw) {
            alert('您的余额不足')
            return false;
        } else if (num > 200) {
            alert('单次只能提现200元')
            return false;
        }
        return true;
    },
    _validateMoney: function (num) {
        /*
        * 现金验证
        * */
        var _this = this;
        var reg = /^[1-9]\d*$/,
            numtotal = _this.cashModel.get('num');
        if (num == '') {
            alert('请填写金额')
            return false;
        } else if (!reg.test(num)) {
            alert('请填写正整数')
            return false;
        } else if (num > numtotal) {
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