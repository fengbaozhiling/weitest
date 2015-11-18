var api = require('../api');
module.exports =  Backbone.Model.extend({
    url: api.perfectInfo,
    initialize: function () {
        return this;
    }
});