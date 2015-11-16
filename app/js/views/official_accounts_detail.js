'use strict';

define([
    'doT',
    'text!tpl/official_accounts_detail.html'
], function ( doT, tpl) {
    var userView = Backbone.View.extend({
        el: $('#publicView'),
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
            var _this = this;
        },
        render: function () {
            var _this = this;
            _this.$el.html(_this.template());
            return this;
        }
    });

    return userView;
});
