var doT = require('../../lib/dot/dot');
var dialog = require('../component/dialog/dialog');
var api = require('../api');
var WithModel = require('../models/withdraw_list');
var tpl = require('html!../tpl/withdraw_list.html');

module.exports = Backbone.View.extend({
    el: $('#withdrawListView'),
    template: doT.template(tpl),
    tagName: 'div',
    events: {

    },
    initialize: function () {
        var _this = this;
        _this.withModel = new WithModel;
        _this.listenTo(_this.withModel, 'sync', this.render);
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template(_this.withModel.toJSON()));
        return this;
    }
});