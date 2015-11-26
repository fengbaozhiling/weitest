var doT = require('../../../lib/dot/dot');
var tpl = require('html!../tpl/index.html');

module.exports = Backbone.View.extend({
    el: $('#viewMain'),
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
    },
    render: function () {
        var _this = this;
        _this.$el.addClass('block').html(_this.template());

        return this;
    }
});