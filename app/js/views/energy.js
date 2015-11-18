var doT = require('../../lib/dot/dot');
var tpl = require('html!../tpl/energy.html');

module.exports =  Backbone.View.extend({
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
    },
    render: function (el) {
        return this;
    }
});