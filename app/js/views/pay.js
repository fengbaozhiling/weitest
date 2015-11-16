'use strict';

define([
    'doT',
    'api',
    'dialog',
    'text!tpl/pay.html'
], function (doT, api, dialog, tpl) {

    var userView = Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        tagName: 'div',
        events: {
            'click #buyBao': '_buy'
        },
        _buy: function (e) {

            var _this = this;
            var formBox = $('#buyBaoForm');
            var text = $.trim(formBox.find('input[name="weixin"]').val());
            if (text == '') {
                var d = new dialog({
                    content: '微信号必须填写',
                    title: false,
                    time: false,
                    ok: function () {
                        d.close();
                    }
                });
                return;
            }
            if (_this.firstBuy) {
                $(e.target).html('请求中...').addClass('disabled');
                _this.firstBuy = false;
                $.ajax({
                    url: api.getVip,
                    data: 'weixin=' + text,
                    method: 'POST',
                    success: function (data) {
                        _this.firstBuy = true;
                        $(e.target).html('立即购买').removeClass('disabled');
                        if (data.status === 0) {
                            var d = new dialog({
                                content: data.info,
                                title: false,
                                time: false,
                                ok: function () {
                                    d.close();
                                }
                            });
                            return;
                        }
                        if (data.url) {
                            window.location = data.url;
                        }
                    }
                });
            }
            return false;
        },
        initialize: function () {
            /*
             * 第一次点击购买
             * */
            this.firstBuy = true;
        },
        _getFansCount: function () {
            var _this = this;
            $.ajax({
                url:api.getFansCount,
                success:function(data){
                    console.log(data);
                    var html = '<div class="fansCount"><span>已有' +
                        data.content +
                        '人加入我们！</span></div>';
                    $('#payView > .top-banner').append(html)
                }

            })
        },

        render: function () {
            var _this = this;
            _this.$el.html(_this.template());
            _this._getFansCount()
            return this;
        }
    });

    return userView;
});
