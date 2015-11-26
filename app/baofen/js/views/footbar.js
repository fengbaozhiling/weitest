var doT = require('../../../lib/dot/dot');
var footBarCrent = require('../tool/foot_bar_crent');
var tpl = require('html!../tpl/foot_bar.html');

module.exports = Backbone.View.extend({
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
        this.footBarCrent = footBarCrent;
    },
    render: function () {

        return this;
    }
});