var api = require('../api');
module.exports =  Backbone.Model.extend({
    defaults:function(){
        return {
            page_url:'withdraw_list',
            data: []
        }
    },
    initialize: function () {
        return this;
    },
    url: api.withdrawList
});
