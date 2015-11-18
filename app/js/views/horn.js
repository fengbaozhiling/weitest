var doT = require('../../lib/dot/dot');
var dialog = require('../component/dialog/dialog');
var Model = require('../models/horn');
var tpl = require('html!../tpl/horn.html');

module.exports = Backbone.View.extend({
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