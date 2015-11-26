var doT = require('../../../lib/dot/dot');
var dialog = require('../../../component/dialog/dialog');
var Alert = require('../../../component/alert/alert');
var Biu = require('../../../component/biu/biu');
var Hammer = require('../../../lib/hammer/hammer');
var api = require('../api');
var countDown = require('../tool/count_text');
var EnergyBox = require('./energy');
var QueueBox = require('./queue');
var ChatModel = require('../models/chat');
var ListModel = require('../models/list');
var UserModel = require('../models/user');
var Energy = require('../models/energy');
var tpl = require('html!../tpl/list.html');
var hornMessageTpl = require('html!../tpl/horn_message.html');

module.exports =  Backbone.View.extend({
    el: '#listView',
    template: doT.template(tpl),
    templateMessage: doT.template(hornMessageTpl),
    tagName: 'div',
    events: {
        'click .add-friend': 'addFriend',
        'click #countDown a': '_refresh',
        'click #userEnergy': 'queue',
        'click #userHorn' : function(e) {
            var _this = this;
            var html = '<form class="horn-form"><div class="horn-form">';
            var message = _this.chatmodel.get('message');
            for (var i in message) {
                html += '<label data-id="'+ message[i].id +'" class="list-group-item">' +
                    message[i].value +
                    '<input type="radio" name="message" value="'+ message[i].value +'" />' +
                    '</label>';
            }
            html += '</div></form>';
            dialog.prototype.choose = function() {
                var _that = this;
                $('#d' + _that.id).find('label').on('click',function(){
                    $(this).addClass('active').siblings().removeClass('active');
                })
            };
            var d = new dialog({
                content: html,
                title: '选择喇叭',
                time: false,
                ok: {
                    value: '使用喇叭',
                    fn: function () {
                        var data = $('#d' + d.id).find('form').serializeArray();
                        if (data!='') {
                            _this.socketIo.emit('horn', data);
                            d.close();
                        }
                    }
                },
                cancel: function () {
                    d.close();
                }
            });
            d.choose();
        }
    },
    /*
     * 刷新数据列表
     * */
    _refresh: function (e) {
        $(e.target).parents('a').html('<i class="iconfont icon-shuaxin roll"></i>请求中...').addClass('disabled');

        var _this = this;
        if (_this.refrshClick) {
            _this.refrshClick = false;
            _this.getData();
        }
    },
    /*
     * 使用能量插队
     * */
    _userEnergy: function () {
        var _this = this;
        var uid = _this.userInfo.get('id');
        var crentEnergy = _this.userInfo.get('energy');
        var text_1 = '友情提示：插队能影响下次队列中的排名，倒计时结束后可以点击刷新看最新结果。';
        if (crentEnergy == 0) {
            var tips = new dialog({
                content: '<div class="za-container">' +
                '<div class=" za-alert za-alert-success">' +
                '<div class="text-danger">你的能量点数为0，无法插队</div>' +
                '</div>' +
                '<div class="alert-out alert-out-warning">' +
                text_1 +
                '</div>' +
                '</div>',
                title: false,
                time: false,
                ok: function () {
                    tips.close();
                }

            });
            return;
        }

        var d = new dialog({
            content: '<div class="za-container">' +
            '<div class=" za-alert za-alert-success">' +
            '插队需要消耗能量点，您现在的能量点数' + crentEnergy + '插队后会全部消耗完，请确认！' +
            '</div>' +
            '<div class="alert-out alert-out-warning">' +
            text_1 +
            '</div>' +
            '</div>',
            title: false,
            time: 100000,
            ok: {
                value: '确定插队',
                fn: function () {

                    $.ajax({
                        url: api.queue,
                        data: {'qr': true},
                        method: 'GET',
                        success: function (data) {
                            _this.userInfo.set('energy', 0);
                            var tips = new Biu({
                                box: '#listView',
                                class: 'tips-biu text-danger energy-tips animated fadeInUp',
                                content: '插队成功',
                                time: 2000,
                                css: {
                                    left: '35%',
                                    bottom: '2rem'
                                }
                            });
                            d.close();
                        }
                    })

                }
            },
            cancel: function () {
                d.close();
            }
        })
    },
    /*
     * 立即插队
     * */
    queue: function (e) {
        var _this = this;
        if (_this.queueClick) {
            _this.queueClick = false;
            $(e.target).html('请求中...').addClass('disabled');
            $.ajax({
                url: api.queue,
                method: 'GET',
                success: function (data) {
                    _this.queueClick = true;
                    $(e.target).html('立即插队').removeClass('disabled');
                    if (data.qrcode === 0) {
                        _this.upLoadQcode();
                    } else {
                        _this._userEnergy();
                    }

                },
                error: function (res) {
                    _this.queueClick = true;
                    $(e.target).html('立即插队').removeClass('disabled')
                }
            });
        }
        return false;
    },
    /*
     * 上传二维码
     * */
    upLoadQcode: function () {
        var html = '您必须先上传二维码才能加入队列';
        var uploadCode = new dialog({
            content: html,
            title: '上传二维码',
            close: true,
            ok: {
                value: '立即上传',
                fn: function () {
                    wx.chooseImage({
                        count: 1,
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            wx.uploadImage({
                                localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    var serverId = res.serverId; // 返回图片的服务器端ID
                                    $.ajax({
                                        url: api.uploadQrcode,
                                        data: {'serverId': serverId},
                                        method: 'POST',
                                        success: function (data) {
                                            uploadCode.close();
                                            if (data.status === 1) {
                                                window.location = '#qcode_upload';
                                            } else {
                                                var d = new dialog({
                                                    content: data.info,
                                                    title: false,
                                                    time: false,
                                                    ok: function () {
                                                        d.close();
                                                    }
                                                });
                                            }
                                        }
                                    })

                                }
                            });
                        }
                    });
                }
            },
            cancel: {
                value: '从公众帐号上传',
                fn: function () {
                    window.location = '#jiaochen/qcode';
                    uploadCode.close();
                }
            }
        });
    },
    /*
     * 加好友
     * */
    PlusEnergy: null,
    addFriend: function (e) {
        var _this = this;
        var target = e.target;
        var imgUrl = $(target).data('qcode');
        var myId = _this.userInfo.get('id');
        var uid = $(target).data('uid');
        var imageObj = new Image();
        imageObj.src = imgUrl;
        imageObj.className = 'img-responsive';
        var html = '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>';
        dialog.prototype.addFriend = function () {
            var _that = this;
            imageObj.onload = function () {
                $('#d' + _that.id).find('.d-content > .d-c-p').html(imageObj);
                $('#d' + _that.id).find('.sk-cube-grid').remove();
                _that._position();
                var imgEl = $('#d' + _that.id + ' img');
                var handler = new Hammer(imgEl[0]);
                var first = true;
                var crentEnergy = parseInt(_this.userInfo.get('energy'));
                handler.on('press', function () {
                    if (!first) {
                        return;
                    }
                    $.ajax({
                        url: _this.energy.url,
                        data: {'uid': myId},
                        method: 'POST',
                        success: function (data) {
                            _this.PlusEnergy = data.energy;
                            first = false;
                            /*
                             * 是否长按了二维码
                             * */
                            codeBox.isAdd = true;
                            var num = crentEnergy + 1;
                            _this.userInfo.set('energy', num);
                        }
                    })
                });
            }
        };
        dialog.prototype.isAdd = false;
        var codeBox = new dialog({
            content: html,
            title: '长按二维码',
            close: true,
            closeCb: function () {
                /*
                 * 是否长按了二维码，如果是，则能量增加的效果
                 * */
                if (codeBox.isAdd) {
                    var tips = new Biu({
                        box: '#listView',
                        class: 'tips-biu text-danger energy-tips animated fadeInUp',
                        content: '+' + _this.PlusEnergy,
                        time: 2000,
                        css: {
                            left: '45%',
                            bottom: '45%'
                        }
                    });
                }
            }
        });
        codeBox.addFriend();
        return false;
    },
    initialize: function () {
        var _this = this;
        /*
         * 立即插队按钮单次点击控制
         * */
        _this.queueClick = true;
        _this.refrshClick = true;
        /*
         * 列表数据模型
         * */
        _this.model = new ListModel();
        /*
         * 用户信息
         * */
        _this.userInfo = new UserModel();
        /*
         * 能量点数
         * */
        _this.energy = new Energy();
        /*
         * 喇叭信息
         * */
        _this.chatmodel = new ChatModel;
        _this.listenTo(_this.model, 'change', this.render);
        _this.listenTo(_this.userInfo, 'sync', this._rendUser);
        _this.listenTo(_this.userInfo, 'change:energy', this._rendEnergy);
        _this.listenTo(_this.model, 'change:time', this._countDown);
    },
    _rendUser: function () {
        var _this = this;
        _this._renderQueue();
        _this._rendEnergy();
    },
    getData: function () {
        var _this = this;
        _this.userInfo.fetch();
        _this.model.fetch({
            success: function () {
                _this.refrshClick = true;
            }
        });
    },
    _rendEnergy: function () {
        var _this = this;
        var crentEnergy = _this.userInfo.get('energy');
        var total = 500;
        var energyBox = new EnergyBox();
        var num = crentEnergy / total;
        _this.$el.find('#energyView').html(energyBox.template());
        /*
         * 转换成百分比
         * */
        var toPercent = function (num, n) {
            n = n || 2;
            return ( Math.round(num * Math.pow(10, n + 2)) / Math.pow(10, n) ).toFixed(n) + '%';
        };
        var percent = toPercent(num, 2);
        this.percent = percent;
        $('.za-progress-bar').css({
            'width': percent
        });
        return this;
    },
    _renderQueue: function () {
        var _this = this;
        /*
         * 渲染排入队列
         * */
        var queueBox = new QueueBox();
        _this.$el.find('#queueView').html(queueBox.template(_this.userInfo.toJSON()));
        _this._countDown();
        return this;
    },
    _countDown: function () {
        var restTime = this.model.get('time');
        /*
         * 倒计时
         * */
        var $countDown = $('#countDown');
        countDown($countDown, restTime);
        return this;
    },
    _renderHorn:function(){
        var _this = this;
        _this.socketIo =  new io.connect(api.socketHorn,{'reconnect':false});
        _this.socketIo.on('connect', function(){
            _this.socketIo.emit('login', globConfig.uid);
        });
        //监听喇叭信息
        _this.socketIo.on('horn', function(o){
            _this.$el.find('#listHornView').html(_this.templateMessage(o));
        });
        return this;
    },
    render: function () {
        var _this = this;
        _this.$el.find('#listContView').html(_this.template(_this.model.toJSON().data));
        _this._renderHorn();

        var infoAlert = new Alert('.top-info .za-close',function(){
            _this.userInfo.set({
                'hasRead':true
            });
        });
        return this;
    }
});