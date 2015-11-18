var api = require('../api');
module.exports =  Backbone.Model.extend({
    initialize: function () {
        return this;
    },
    url: api.rank
});