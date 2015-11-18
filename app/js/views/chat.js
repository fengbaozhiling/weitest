var doT = require('../../lib/dot/dot');
var dialog = require('../component/dialog/dialog');
var chatMode = require('../models/chat');
var Horn = require('./horn');
var tpl = require('html!../tpl/chat.html');

module.exports = Backbone.View.extend({
    el: $('#viewMain'),
    template: doT.template(tpl),
    tagName: 'div',
    events:{
        'click .horn-bar' : function(e) {
            var _this = this;
            var html = '<form class="horn-form"><div class="horn-form">';
            var message = _this.model.get('message');
            for (var i in message) {
                html += '<label data-id="'+ message[i].id +'" class="list-group-item">' +
                    message[i].value +
                    '<input type="radio" name="message" value="'+ message[i].value +'" />' +
                    '</label>';
            }
            html += '</div></form>';
            dialog.prototype.choose = function() {
                var _that = this;
                $('#d' + _that.id).find('label').on('click',function(){
                    $(this).addClass('active').siblings().removeClass('active');
                })
            };

            var d = new dialog({
                content: html,
                title: '选择喇叭',
                time: false,
                ok: {
                    value: '使用喇叭',
                    fn: function () {
                        var data = $('#d' + d.id).find('form').serialize();
                        if (data!='') {
                            _this.socketIo.emit('horn', {data:data});
                            d.close();
                        }
                    }
                },
                cancel: function () {
                    d.close();
                }
            });
            d.choose();
        }
    },
    initialize: function () {
        var _this = this;
        _this.model = new chatMode;
        _this.hornVeiw = new Horn;
    },
    render: function () {
        var _this = this;
        _this.$el.addClass('block').html(_this.template());

        _this.hornVeiw.render(_this.$el);


        _this.socketIo =  io.connect('http://localhost:3000/');

        //监听新用户登录
        _this.socketIo.on('horn', function(o){
            console.log(o)
        });

        return this;
    }
});