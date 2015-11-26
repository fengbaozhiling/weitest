var list = require('./views/list');
var appCache = require('./appCache');
var detail = require('./views/detail');



module.exports = Backbone.Router.extend({
    routes: {
        '': 'list',
        'list': 'list',
        'list/:p': 'list',
        'detail':'detail',
        'detail/:id':'detail'
    },
    cacheInitialize: function () {
        appCache.initialize(function () {
            var view = {};
            view.list = new list;
            view.detail = new detail;
            return view;
        });
        this.cached = appCache.get();
    },
    initialize: function () {
        this.cacheInitialize();
    },
    list:function(p){
        this.cached.list.fetch(p);
    },
    detail:function(id){
        this.cached.detail.fetch(id);
    }
});
