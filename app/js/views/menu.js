var doT = require('../../lib/dot/dot');
var tpl = require('html!../tpl/menu.html');


module.exports = Backbone.View.extend({
    el: $('#menuView'),
    template: doT.template(tpl),
    tagName: 'div',
    events:{
        'click .n-1 > a': function(e) {
            var el = e.target;
            if ($(el).parents('.n-1').hasClass('active')) {
                $(el).parents('.n-1').removeClass('active');
            } else {
                $(el).parents('.n-1').addClass('active');
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