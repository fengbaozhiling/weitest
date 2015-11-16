'use strict';
define(function (require) {
    var api = require('api');
    return Backbone.Model.extend({
        initialize: function () {
            return this;
        },
        url: api.soldNote
    });
})
;
