'use strict';
define(function (require) {
    var api = require('api');

    return Backbone.Model.extend({
        url: api.placard_rank,
        initialize: function () {
            return this;
        }
    });
});
