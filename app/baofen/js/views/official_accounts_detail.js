var doT = require('../../../lib/dot/dot');
var tpl = require('html!../tpl/official_accounts_detail.html');

module.exports = Backbone.View.extend({
    el: $('#publicView'),
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
        var _this = this;
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template());
        return this;
    }
});