'use strict';
define(function (require) {
    var api = require('api');
    return Backbone.Model.extend({
        defaults:function(){
            return {
                sender:'张三丰test',
                for:'',
                content:'在JavaScript中，原型也是一个对象，通过原型可以实现对象的属性继承，JavaScript的对象中都包含了一个" [[Prototype]]"内部属性，这个属性所对应的就是该对象的原型。',
                sound:'',
                message:[
                    {
                        id:'1',
                        value:'喇叭信息1'
                    },
                    {
                        id:'2',
                        value:'喇叭信息2'
                    },
                    {
                        id:'3',
                        value:'喇叭信息3'
                    }
                ]
            }

        },
        initialize: function () {
            return this;
        },
        url: 'http://localhost:3000/'
    });
})
;
