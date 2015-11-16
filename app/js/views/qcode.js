'use strict';

define([
    'doT',
    'api',
    'models/qcode',
    'views/footbar',
    'text!tpl/qcode.html'
], function (doT, api, Model, FootBar, tpl) {
    return Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
            var _this = this;
            _this.model = new Model;
            _this.listenTo(_this.model, 'change', this.render);
        },
        render: function () {
            var _this = this;
            _this.$el.html(_this.template(_this.model.toJSON()));
            var footBar = new FootBar();
            _this.$el.append(footBar.render().template());
            footBar.footBarCrent('.footer-bar a');
            return this;
        }
    });
});
