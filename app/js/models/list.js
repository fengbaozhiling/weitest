'use strict';
define(function (require) {
    var api = require('api');

    var listModel = Backbone.Model.extend({
        url: api.list,
        initialize: function () {
            return this;
        }
    });

    return listModel;
});
