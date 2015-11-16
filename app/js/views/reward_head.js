'use strict';

define([
    'doT',
    'text!tpl/reward_head.html'
], function ( doT, tpl) {
    return Backbone.View.extend({
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
        },
        render: function () {
            return this;
        }
    });;
});
