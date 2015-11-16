'use strict';

define([
    'doT',
    'dialog',
    'api',
    'models/withdraw_list',
    'text!tpl/withdraw_list.html'
], function (doT, dialog, api, WithModel, tpl) {
    var energyView = Backbone.View.extend({
        el: $('#withdrawListView'),
        template: doT.template(tpl),
        tagName: 'div',
        events: {

        },
        initialize: function () {
            var _this = this;
            _this.withModel = new WithModel;
            _this.listenTo(_this.withModel, 'sync', this.render);
        },
        render: function () {
            var _this = this;
            _this.$el.html(_this.template(_this.withModel.toJSON()));
            return this;
        }
    });
    return energyView;
});
