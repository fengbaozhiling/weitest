var api = require('../api');
module.exports =  Backbone.Model.extend({
    defaults:function(){
      return {
          page_url:'reward'
      }
    },
    initialize: function () {
        return this;
    },
    url: api.soldNote
});