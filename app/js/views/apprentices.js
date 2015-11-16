'use strict';

define([
    'doT',
    'models/apprentices',
    'text!tpl/apprentices.html'
], function (doT, Apprentices, tpl) {
    var userView = Backbone.View.extend({
        el: '#viewMain',
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
            var _this = this;
            this.model = new Apprentices;
            _this.listenTo(_this.model, 'change', this.render);
        },
        render: function () {
            var _this = this;
            _this.$el.addClass('block').html(_this.template(_this.model.toJSON()));
            _this.$el.siblings().removeClass('block');
/*            _this.viewBoxScroll = new IScrollProbe('#apprenticesView', {
                mouseWheel: true,
                deceleration: 0.0002,
                probeType: 2
            });*/
            return this;
        }
    });

    return userView;
});
