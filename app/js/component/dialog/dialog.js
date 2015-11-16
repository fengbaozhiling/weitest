define(function () {
    var Dialog = {};
    var $win = $(window),
        $doc = $(document),
        $body = $(document.body);

    var id = new Date().getTime();

    var Dialog = function (opa) {
        this.options = {
            title: '确定ʾ',
            content: '内容',
            ok: null,
            cancel: null,
            close: null,
            time: 1500,
            isClose: true,
            closeCb:null,
            maskClose: true,
            offsetTop: 0,
            zIndex: 999,
            callBack: null
        };
        this.id = id;
        this._init(opa)._create()._event()._position();
    };
    Dialog.prototype = {
        _init: function (opa) {
            $.extend(this.options, opa);
            var btn = {
                    ok: this.options.ok,
                    cancel: this.options.cancel
                },
                txt = {
                    ok: '确定',
                    cancel: '取消'
                },
                isObj = function (obj) {
                    return obj !== null && typeof obj === 'object';
                };
            if (isObj(btn.ok) && !btn.ok.value) {
                this.options.ok.value = txt.ok;
            } else if ($.isFunction(btn.ok)) {
                this.options.ok = {
                    value: txt.ok,
                    fn: btn.ok
                };
            }
            ;
            if (isObj(btn.cancel) && !btn.cancel.value) {
                this.options.cancel = txt.cancel;
            } else if ($.isFunction(btn.cancel)) {
                this.options.cancel = {
                    value: txt.cancel,
                    fn: btn.cancel
                };
            }
            ;

            return this;
        },
        _create: function () {
            if (this.options.id) {
                id = this.options.id;
            }
            var html = '', hasTitle = this.options.title, hasOk = this.options.ok, hasCancel = this.options.cancel, isClose = this.options.isClose;
            this._id = id;
            html = '<div id="l' + id + '" class="dialog-layout" style="z-index:' + this.options.zIndex + '"></div>';
            html += '<div id="d' + id + '" class="dialog-wrap" style="z-index:' + (this.options.zIndex + 1) + '">';
            html += '<div class="dialog">';
            if (hasTitle) {
                html += '<div id="t' + id + '" class="d-title" unselectable="on">';
                html += '<span>' + this.options.title + '</span>';
                if (isClose) {
                    html += '<span id="c' + id + '" class="d-close" type="button" title="关闭"><i class="iconfont icon-guanbi"></i></span>';
                }
                html += '</div>';
            }
            html += '<div class="d-content d-bg">';
            if (this.options.content) {
                html += '<div class="d-c-p">' + this.options.content + '</d>';
            } else {
                html += '<div class="d-c-p">没有内容</div>';
            }
            ;
            html += '</div>';

            if (hasOk || hasCancel) {
                html += '<div class="d-bottom d-bg">';
                if (hasOk) {
                    html += '<a id="ob' + id + '" class="d-ok d-btn" title="' + this.options.ok.value + '">' + this.options.ok.value + '</button>';
                }
                ;
                if (hasCancel) {
                    html += '<a id="cb' + id + '" class="d-cancle d-btn" title="' + this.options.cancel.value + '">' + this.options.cancel.value + '</button>';
                }
                html += '</div>';
                html += '</div>';
            }
            html += '</div>';
            $body.append(html);


            return this;
        },
        _position: function () {
            var $dialog = $('#d' + this._id),
                left = ($win.width() - $dialog.width()) / 2,
                top = ($win.height() - $dialog.height()) / 4,
                top = top - this.options.offsetTop;

            $dialog.css({left: left, top: top > 0 ? top : 0});

            var init = this.options.init;
            if (init && typeof init === 'function') {
                init();
            }
            return this;
        },
        _event: function () {
            var self = this,
                id = this._id,
                hasTitle = this.options.title,
                hasOk = this.options.ok,
                hasCancel = this.options.cancel,
                isClose = this.options.isClose;
            var btnok = null, btncancel = null;
            this._close = function () {
                $(this).unbind('click');
                if (hasOk) {
                    btnok.unbind('click')
                }
                if (hasCancel) {
                    btncancel.unbind('click')
                }
                if (self.options.closeCb) {
                    self.options.closeCb()
                }
                self._remove();
            };
            if (hasTitle) {
                $('#t' + id).css('cursor', 'default');
                if (isClose) {
                    $('#c' + id).on('click', self._close);
                }
            } else {
                if (self.options.time) {
                    setTimeout(function () {
                        self._remove();
                    }, self.options.time);
                }
            }
            if (hasOk) {
                btnok = $('#ob' + id).click(function () {
                    if (self.options.ok.fn) {
                        self.options.ok.fn();
                    }
                    return false;
                });
            }
            if (hasCancel) {
                btncancel = $('#cb' + id).click(function () {
                    if (self.options.cancel.fn) {
                        self.options.cancel.fn();
                    }
                    return false;
                });
            }
            if (self.options.maskClose) {
                $('#l' + id).click(function () {
                    self._remove();
                    return false;
                });
            }
            return this;
        },
        _remove: function () {
            var id = this._id,
                l = document.getElementById('l' + id),
                d = document.getElementById('d' + id);

            if (d) {
                document.body.removeChild(d);
            }
            if (l) {
                document.body.removeChild(l);
            }
        },
        close: function () {
            if (this._close) {
                this._close.call(document.getElementById('c' + this._id));
            }
        },
        show: function () {

        }
    };
    return Dialog;
});

