var doT = require('../../../lib/dot/dot');
var FootBar = require('./footbar');
var tpl = require('html!../tpl/rank.html');
module.exports = Backbone.View.extend({
    el: '#viewMain',
    template: doT.template(tpl),
    tagName: 'div',

    initialize: function () {
    },
    render: function () {
        var footBar = new FootBar();
        var _this = this;
        _this.$el.addClass('block').html(_this.template());
        _this.$el.siblings().removeClass('block');
        _this.$el.append(footBar.render().template());
        footBar.footBarCrent();
        return this;
    }
});