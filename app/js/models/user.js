'use strict';
define(function (require) {
    var api = require('api');
    return Backbone.Model.extend({
        defaults:function() {
          return {
              energy: "0",
              id: 21,
              is_queue: false,
              is_vip: 1,
              level: "普通会员",
              nickname: "聊天交友，互粉互助",
              time: "2015-10-22"
          }
        },
        initialize: function () {
            return this;
        },
        url: api.userInfo
    });
})
;
