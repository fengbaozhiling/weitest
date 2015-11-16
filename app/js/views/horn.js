'use strict';

define([
    'doT',
    'models/horn',
    'dialog',
    'Hammer',
    'text!tpl/horn.html'
], function (doT, Model, dialog, Hammer, tpl) {
    return Backbone.View.extend({
        template: doT.template(tpl),
        tagName: 'div',

        initialize: function () {
            var _this = this;
            _this.hornModel = new Model
        },
        render: function (el) {
            var _this = this;
            el.append(_this.template());

            return this;
        }
    });
});
