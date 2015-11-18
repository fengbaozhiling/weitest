var doT = require('../../lib/dot/dot');
var dialog = require('../component/dialog/dialog');
var api = require('../api');
var footBarCrent = require('../tool/foot_bar_crent');
var rank = require('../models/rank');
var tpl = require('html!../tpl/rank.html');


module.exports = Backbone.View.extend({
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