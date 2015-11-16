'use strict';

define([
    'doT',
    'text!tpl/jiaochen_qcode.html'
], function ( doT, tpl) {

    var userView = Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        initialize: function () {
            return this;
        },
        render: function () {
            var _this = this;
            _this.$el.addClass('block').html(_this.template());
            return this;
        }
    });

    return userView;
});
