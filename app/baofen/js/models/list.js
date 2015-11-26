var api = require('../api');
module.exports =  Backbone.Model.extend({
    url: api.list,
    initialize: function () {
        return this;
    }
});