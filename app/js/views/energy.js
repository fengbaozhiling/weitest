'use strict';

define([
    'doT',
    'text!tpl/energy.html'
], function ( doT, tpl) {
    var energyView = Backbone.View.extend({
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
        },
        render: function (el) {
            return this;
        }
    });
    return energyView;
});
