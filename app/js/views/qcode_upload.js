'use strict';

define([
    'doT',
    'api',
    'dialog',
    'models/qcode_upload',
    'text!tpl/qcode_upload.html'
], function (doT, api, dialog, Model, tpl) {
    var userView = Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        tagName: 'div',
        events:{
            'click #upload_form .za-btn': '_upload'
        },
        _upload : function(e){
            var form = $('#upload_form'),
                _this = this;

            if ($.trim(form.find('[name="desc"]').val()) == '') {
                var d = new dialog({
                    content: '请填写描述',
                    title: false,
                    time: false,
                    ok: function () {
                        d.close();
                    }
                });
                return;
            }
            if (_this.fistUpload) {
                $(e.target).html('请稍候...').addClass('disabled');
                _this.fistUpload = false;
                $.ajax({
                    url:api.perfectInfo,
                    method:'POST',
                    data:form.serialize(),
                    success:function(data){
                        _this.fistUpload = true;
                        $(e.target).html('确定更改').removeClass('disabled');
                        if (data.status == 1) {
                            var d = new dialog({
                                content: '更改成功',
                                title: false,
                                time: false,
                                ok: function () {
                                    d.close();
                                    window.location = '#list';
                                }
                            });
                        }
                        if (data.status == 0) {
                            var d = new dialog({
                                content: '上传失败，请重试！',
                                title: false,
                                time: false,
                                ok: function () {
                                    d.close();
                                }
                            });
                        }
                    }
                })
            }
        },
        initialize: function () {
            var _this = this;

            /*
            * 防止多次点击
            * */
            _this.fistUpload = true;

            _this.model = new Model();
            _this.listenTo(_this.model, 'sync', this.render);
        },
        render: function () {
            var _this = this;
            _this.$el.addClass('block').html(_this.template(_this.model.toJSON()));
            _this.$el.siblings().removeClass('block');
            return this;
        }
    });

    return userView;
});
