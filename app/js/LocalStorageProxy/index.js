define(function (require) {
    var LocalStorage = require('./base/LocalStorage');
    var LocalStorageProxy = require('./LocalStorageProxy');
    var toDataUrl = require('./base/toDataUrl');

    return {
        toDataUrl: toDataUrl,
        LocalStorage: LocalStorage,
        LocalStorageProxy: LocalStorageProxy
    }
});