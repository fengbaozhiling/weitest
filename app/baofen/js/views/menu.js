var doT = require('../../../lib/dot/dot');
var tpl = require('html!../tpl/menu.html');


module.exports = Backbone.View.extend({
    el: $('#menuView'),
    template: doT.template(tpl),
    tagName: 'div',
    events:{
        'click .menu-box > a': function(e) {
            var el = e.target;
            if ($(el).parents('.menu-box').hasClass('active')) {
                $(el).parents('.menu-box').removeClass('active');
            } else {
                $(el).parents('.menu-box').addClass('active');
            }
            return false;

        }
    },
    initialize: function () {
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template());
        return this;
    }
});