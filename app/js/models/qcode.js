'use strict';
define(function (require) {
    var api = require('api');

    var listModel = Backbone.Model.extend({
        url: api.getQrcode,
        initialize: function () {
            return this;
        }
    });

    return listModel;
});
