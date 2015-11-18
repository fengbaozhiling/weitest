var fastClick = require('../lib/fastclick/fastclick');

fastClick.attach(document.body);

/*
 * 引入路由
 * */
var Baofen = require('./rout');
var baofen = new Baofen();

Backbone.history.start();