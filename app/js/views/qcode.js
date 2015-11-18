var doT = require('../../lib/dot/dot');
var api = require('../api');
var Model = require('../models/qcode');
var FootBar = require('./footbar');
var tpl = require('html!../tpl/qcode.html');


module.exports = Backbone.View.extend({
    el: $('#viewMain'),
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
        var _this = this;
        _this.model = new Model;
        _this.listenTo(_this.model, 'change', this.render);
    },
    render: function () {
        var _this = this;
        _this.$el.html(_this.template(_this.model.toJSON()));
        var footBar = new FootBar();
        _this.$el.append(footBar.render().template());
        footBar.footBarCrent('.footer-bar a');
        return this;
    }
});