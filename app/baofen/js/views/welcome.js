var doT = require('../../../lib/dot/dot');
var tpl = require('html!../tpl/welcome.html');


module.exports = Backbone.View.extend({
    el: $('#viewMain'),
    template: doT.template(tpl),
    tagName: 'div',
    events: {
    },
    initialize: function () {

    },
    render: function () {
        var _this = this;
        _this.$el.addClass('block').html(_this.template());
        _this.$el.siblings().removeClass('block');



        return this;
    }
});