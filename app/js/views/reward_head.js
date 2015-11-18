var doT = require('../../lib/dot/dot');
var tpl = require('html!../tpl/reward_head.html');

module.exports =  Backbone.View.extend({
    template: doT.template(tpl),
    tagName: 'div',
    initialize: function () {
    },
    render: function () {
        return this;
    }
});;