'use strict';

define([
    'doT',
    'text!tpl/welcome.html'
], function ( doT, tpl) {

    var userView = Backbone.View.extend({
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
/*

            var viewBoxScroll = new IScrollProbe('#welcomeView', {
                mouseWheel: true,
                deceleration: 0.0002,
                probeType: 2
            });
*/


            return this;
        }
    });

    return userView;
});
