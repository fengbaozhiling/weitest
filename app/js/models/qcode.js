var api = require('../api');
module.exports =  Backbone.Model.extend({
    url: api.getQrcode,
    initialize: function () {
        return this;
    }
});