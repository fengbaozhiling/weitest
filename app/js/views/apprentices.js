var doT = require('../../lib/dot/dot');
var Apprentices = require('../models/apprentices');
var tpl = require('html!../tpl/apprentices.html');
module.exports = Backbone.View.extend({
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