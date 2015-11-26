var doT = require('../../../lib/doT/doT');
var tpl = require('html!./detail.html');
var List = require('../modules/detail');
var Alert = require('../../../component/alert/alert');
var size = require('../../../component/box_size/box_size');

module.exports = Backbone.View.extend ({
    el: '#detailView',
    events:'',
    template: doT.template(tpl),
    initialize: function () {
        var _this = this;
        _this.model = new List;
        _this.listenTo(this.model, 'sync', _this.renderList);
        return _this;
    },
    fetch:function(id){
        var _this = this;
        _this.model.fetch({data:{id:id}});
        _this.$el.addClass('animated fadeInRight list-show').siblings().removeClass('list-show');
    },
    renderList:function(){
        var _this = this;
        _this.$el.html(_this.template(_this.model.toJSON()));
        _this.$el.scrollTop(0);
        return _this;
    }
});