'use strict';

define([
    'doT',
    'models/tool',
    'text!tpl/tool_detail.html'
], function (doT, Tool, tpl) {
    var userView = Backbone.View.extend({
        el: $('#viewMain'),
        template: doT.template(tpl),
        initialize: function () {
            var _this = this;
            this.model = new Tool();
            _this.listenTo(_this.model, 'sync', this.render);
            return this;
        },
        events: {
            'click .tool-head .back' : function() {
                window.location.href = ('#/tool').replace(/^#+/, '#');
            }
        },
        render: function () {
            var _this = this;
            _this.$el.addClass('block').html(_this.template(this.model.toJSON()));
            _this.$el.siblings().removeClass('block');
            return this;
        }
    });

    return userView;
});
