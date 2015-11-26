var doT = require('../../../lib/dot/dot');
var dialog = require('../../../component/dialog/dialog');
var api = require('../api');
var tpl = require('html!../tpl/placard_welcome.html');
var getQuery = require('../tool/get_query');

module.exports = Backbone.View.extend({
    el: '#placardWelcomeView',
    template: doT.template(tpl),
    tagName: 'div',
    events:{
        'click .za-btn':'_join'
    },
    _join:function(e){
        var _this = this;
        if (_this.joinIsClick) {
            _this.joinIsClick = false;
            $(e.target).html('请稍后...').addClass('disabled');
            var form = _this.$el.find('form');
            var type = getQuery('type');
            if (type == '' || type == null) {
                alert('没有获取到游戏种类')
            }
            form.find('[name="type"]').attr('value',type);
            if ($.trim(form.find('[name="secret_code"]').val()) == '') {
                alert('请填写暗号');
                return;
            }
            $.ajax({
                url:api.secret_code,
                method:'POST',
                data:form.serializeArray(),
                success:function(data){
                    _this.joinIsClick = true;
                    $(e.target).html('立即参加').removeClass('disabled');
                    if (data.status) {
                        window.location = data.content.url
                    } else {
                        alert(data.info)
                    }
                }
            })

        }


    },
    joinIsClick:true,
    initialize: function () {

    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template());
        return this;
    }
});