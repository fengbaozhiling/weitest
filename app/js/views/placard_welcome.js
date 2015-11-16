'use strict';

define([
    'doT',
    'dialog',
    'api',
    'text!tpl/placard_welcome.html'
], function (doT, dialog, api, tpl) {
    return Backbone.View.extend({
        el: '#placardWelcomeView',
        template: doT.template(tpl),
        tagName: 'div',
        events:{
            'click .za-btn':function(){
                var _this = this;
                var form = _this.$el.find('form');
                if ($.trim(form.find('[name="secret_code"]').val()) == '') {
                    alert('请填写暗号')
                    return;
                }
                $.ajax({
                    url:api.secret_code,
                    method:'POST',
                    data:form.serialize(),
                    success:function(data){
                        if (data.status) {
                            window.location = data.content.url
                        } else {
                            alert(data.info)
                        }

                    }
                })
            }
        },
        initialize: function () {
        },
        render: function () {
            var _this = this;
            _this.$el.html(_this.template());
            return this;
        }
    });

});
