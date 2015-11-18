!function(t,e){"function"==typeof define&&define.amd?define(["underscore","backbone"],function(n,r){return e(n||t._,r||t.Backbone)}):e(_,Backbone)}(this,function(t,e){function n(){return(65536*(1+Math.random())|0).toString(16).substring(1)}function r(){return n()+n()+"-"+n()+"-"+n()+"-"+n()+"-"+n()+n()+n()}return e.LocalStorage=window.Store=function(t){this.name=t;var e=this.localStorage().getItem(this.name);this.records=e&&e.split(",")||[]},t.extend(e.LocalStorage.prototype,{save:function(){this.localStorage().setItem(this.name,this.records.join(","))},create:function(t){return t.id||(t.id=r(),t.set(t.idAttribute,t.id)),this.localStorage().setItem(this.name+"-"+t.id,JSON.stringify(t)),this.records.push(t.id.toString()),this.save(),this.find(t)},update:function(e){return this.localStorage().setItem(this.name+"-"+e.id,JSON.stringify(e)),t.include(this.records,e.id.toString())||this.records.push(e.id.toString()),this.save(),this.find(e)},find:function(t){return this.jsonData(this.localStorage().getItem(this.name+"-"+t.id))},findAll:function(){return t(this.records).chain().map(function(t){return this.jsonData(this.localStorage().getItem(this.name+"-"+t))},this).compact().value()},destroy:function(e){return e.isNew()?!1:(this.localStorage().removeItem(this.name+"-"+e.id),this.records=t.reject(this.records,function(t){return t===e.id.toString()}),this.save(),e)},localStorage:function(){return localStorage},jsonData:function(t){return t&&JSON.parse(t)}}),e.LocalStorage.sync=window.Store.sync=e.localSync=function(t,e,n){var r,o,i=e.localStorage||e.collection.localStorage,c=$.Deferred&&$.Deferred();try{switch(t){case"read":r=void 0!=e.id?i.find(e):i.findAll();break;case"create":r=i.create(e);break;case"update":r=i.update(e);break;case"delete":r=i.destroy(e)}}catch(a){o=a.code===DOMException.QUOTA_EXCEEDED_ERR&&0===window.localStorage.length?"Private browsing is unsupported":a.message}return r?(e.trigger("sync",e,r,n),n&&n.success&&n.success(r),c&&c.resolve(r)):(o=o?o:"Record Not Found",n&&n.error&&n.error(o),c&&c.reject(o)),n&&n.complete&&n.complete(r),c&&c.promise()},e.ajaxSync=e.sync,e.getSyncMethod=function(t){return t.localStorage||t.collection&&t.collection.localStorage?e.localSync:e.ajaxSync},e.sync=function(t,n,r){return e.getSyncMethod(n).apply(this,[t,n,r])},e.LocalStorage});