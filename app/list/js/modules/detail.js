var api = require('../api')

module.exports =  Backbone.Model.extend({
    defaults:function(){
        return {
            tips:'分享文章到朋友圈，好友转发或阅读即可产生收入！分享文章到朋友圈，好友转发或阅读即可产生收入！'
        }
    },
    url:api.article_detail,
    initialize: function () {
        return this;
    }
});