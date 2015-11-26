var api = require('../api');
module.exports =  Backbone.Model.extend({
    url: api.official_accounts,
    initialize: function () {
        return this;
    }
});