'use strict';

define([
    'doT',
    'tool/foot_bar_crent',
    'text!tpl/foot_bar.html'
], function ( doT, footBarCrent, tpl) {
    var footerView = Backbone.View.extend({
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
            this.footBarCrent = footBarCrent;
        },
        render: function () {

            return this;
        }
    });
    return footerView;
});
