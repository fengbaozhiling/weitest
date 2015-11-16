'use strict';

define([
    'doT',
    'dialog',
    'api',
    'tool/foot_bar_crent',
    'models/rank',
    'text!tpl/rank.html'
], function (doT, dialog, api, footBarCrent, rank, tpl) {
    var energyView = Backbone.View.extend({
        el: $('#rankView'),
        template: doT.template(tpl),
        tagName: 'div',
        events: {

        },
        initialize: function () {
            var _this = this;
            _this.rankModel = new rank;
            _this.listenTo(_this.rankModel, 'sync', this.render);
        },
        render: function () {
            var _this = this;
            _this.$el.html(_this.template(_this.rankModel.toJSON()));
            footBarCrent('.za-nav a');
            return this;
        }
    });
    return energyView;
});
