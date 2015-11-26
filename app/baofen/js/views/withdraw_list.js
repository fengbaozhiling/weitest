var doT = require('../../../lib/dot/dot');
var dialog = require('../../../component/dialog/dialog');
var api = require('../api');
var WithModel = require('../models/withdraw_list');
var tpl = require('html!../tpl/withdraw_list.html');
var tpl_page = require('html!../tpl/next_page.html');

module.exports = Backbone.View.extend({
    el: $('#withdrawListView'),
    template: doT.template(tpl),
    template_page:doT.template(tpl_page),
    tagName: 'div',
    events: {
        'click .za-media .icon-wenhao01':'_showMsg'
    },
    _showMsg:function(e){
      var target = $(e.target);
        var d = new dialog({
            title: '提示信息',
            content:target.data('msg'),
            ok:function(){
                d.close();
            }
        })
    },
    initialize: function () {
        var _this = this;
        _this.withModel = new WithModel;
        _this.listenTo(_this.withModel, 'sync', this.render);
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template(_this.withModel.toJSON()));
        /*
         * 渲染翻页
         * */
        _this.$el.append(_this.template_page(_this.withModel.toJSON()));
        return this;
    }
});