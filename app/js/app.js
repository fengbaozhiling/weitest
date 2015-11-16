define(function (require) {
    var fastClick = require('fastClick');

    fastClick.attach(document.body);

    /*
     * 引入路由
     * */
    var Baofen = require('rout');
    var baofen = new Baofen();

    Backbone.history.start();
});

