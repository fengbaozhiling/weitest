var doT = require('../../lib/dot/dot');
var tpl = require('html!../tpl/jiaochen.html');

module.exports = Backbone.View.extend({
    el: $('#viewMain'),
    template: doT.template(tpl),
    initialize: function () {
        return this;
    },
    render: function () {
        var _this = this;
        _this.$el.addClass('block').html(_this.template());
        return this;
    }
});