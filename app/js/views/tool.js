'use strict';

define([
    'doT',
    'models/tool',
    'text!tpl/tool.html'
], function ( doT, Tool, tpl) {
    var userView = Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        initialize: function () {
            return this;
        },
        render: function () {
            var _this = this;

            _this.$el.addClass('block').html(_this.template());
            _this.$el.siblings().removeClass('block');
/*
            var jcViewScroll = new IScrollProbe('#toolView', {
                mouseWheel: true,
                deceleration: 0.0002,
                probeType: 2
            });*/
            return this;
        }
    });

    return userView;
});
