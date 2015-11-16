'use strict';

define([
    'doT',
    'models/official_accounts',
    'text!tpl/official_accounts.html'
], function ( doT, Public, tpl) {
    var userView = Backbone.View.extend({
        el: $('#publicView'),
        template: doT.template(tpl),
        tagName: 'div',
        initialize: function () {
            var _this = this;
            _this.model = new Public;
            _this.listenTo(_this.model, 'sync', _this.render);
        },
        render: function () {
            var _this = this;
            _this.$el.html(_this.template(_this.model.toJSON()));

            return this;
        }
    });

    return userView;
});
