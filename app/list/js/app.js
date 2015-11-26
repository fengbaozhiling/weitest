var fastClick = require('../../lib/fastclick/fastclick');
/*var Stage = require('../../utils/Stage');

Backbone.stage = new Stage();
console.log(Backbone.stage)*/

fastClick.attach(document.body);

/*
 * 引入路由
 * */
var List = require('./rout');
var list = new List();

Backbone.history.start();