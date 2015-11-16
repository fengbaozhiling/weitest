requirejs.config({
    baseUrl: globConfig.baseUrl,
    paths: {
        'text': '../lib/requirejs/plugins/text',
        'fastClick': '../lib/fastclick/fastclick',
        'lazyload': '../lib/jquery_lazyload/jquery.lazyload',
        'IScroll': '../lib/iscroll/iscroll',
        'IScrollProbe': '../lib/iscroll/iscroll-probe',
        'Router': '../lib/director/director',
        'qrcode': '../lib/qrcode/jquery.qrcode',
        'doT': '../lib/dot/dot',
        'Hammer':'../../lib/hammer/hammer',

        'mobiCore': '../lib/mobiscroll/js/mobiscroll_core',
        'mobiCore.scroller': '../lib/mobiscroll/js/mobiscroll_scroller',
        'mobiCore.datetime': '../lib/mobiscroll/js/mobiscroll_datetime',
        'mobiCore.select': '../lib/mobiscroll/js/mobiscroll_select',
        'dialog': '../js/component/dialog/dialog'
    },
    shim: {
        IScroll: {
            exports: 'IScroll'
        },
        IScrollProbe: {
            exports: 'IScroll'
        },
        Router: {
            exports: 'Router'
        },
        qrcode: {
            exports: 'qrcode'
        },
        'mobiCore.scroller': {
            deps: ['mobiCore']
        },
        'mobiCore.datetime': {
            deps: ['mobiCore']
        }
    }
});
require(['app']);