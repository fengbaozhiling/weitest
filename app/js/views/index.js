'use strict';

define([
    'doT',
    'text!tpl/index.html'
], function ( doT, tpl) {

    var userView = Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
        },
        render: function () {
            var _this = this;
            _this.$el.addClass('block').html(_this.template());

            return this;
        }
    });

    return userView;
});
