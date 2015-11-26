var doT = require('../../../lib/dot/dot');
var Tool = require('../models/tool');
var tpl = require('html!../tpl/tool.html');

module.exports = Backbone.View.extend({
    el: '#viewMain',
    template: doT.template(tpl),
    initialize: function () {
        return this;
    },
    render: function () {
        var _this = this;

        _this.$el.addClass('block').html(_this.template());
        _this.$el.siblings().removeClass('block');

        return this;
    }
});