'use strict';
define(function (require) {
    var api = require('api');
    return Backbone.Model.extend({
        url: api.official_accounts,
        initialize: function () {
            return this;
        }
    });
});
