var api = require('../api');
module.exports =  Backbone.Model.extend({
    url: api.placard_rank,
    initialize: function () {
        return this;
    }
});