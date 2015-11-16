'use strict';

define([
    'doT',
    'views/footbar',
    'text!tpl/reward_rules.html'
], function ( doT, FootBar, tpl) {
    var rewardRulesView = Backbone.View.extend({
        el: $('#viewMain'),
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
/*
            var viewBoxScroll = new IScrollProbe('#rewardRulesView', {
                mouseWheel: true,
                deceleration: 0.0002,
                probeType: 2
            });*/


            return this;
        }
    });
    return rewardRulesView;
});
