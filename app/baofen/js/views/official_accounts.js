var doT = require('../../../lib/dot/dot');
var Public = require('../models/official_accounts');
var tpl = require('html!../tpl/menu.html');

module.exports = Backbone.View.extend({
    el: $('#publicView'),
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
        var _this = this;
        _this.model = new Public;
        _this.listenTo(_this.model, 'sync', _this.render);
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template(_this.model.toJSON()));

        return this;
    }
});