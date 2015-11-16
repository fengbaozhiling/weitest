'use strict';

define([
    'doT',
    'text!tpl/queue.html'
], function ( doT, tpl) {
    var energyView = Backbone.View.extend({
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
        },
        render: function () {
            return this;
        }
    });
    return energyView;
});
