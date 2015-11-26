var doT = require('../../../lib/doT/doT');
var tpl = require('html!./list.html');
var tplTip = require('html!./list_tip.html');
var tpl_page = require('html!./list_page.html');
var List = require('../modules/list');
var Alert = require('../../../component/alert/alert');

module.exports = Backbone.View.extend({
    el: '#listView',
    template: doT.template(tpl),
    templateTip: doT.template(tplTip),
    templateTop:'<span class="back-top"><i class="iconfont icon-fanhuidingbu"></i><span/>',
    template_page:doT.template(tpl_page),
    initialize: function () {
        var _this = this;
        _this.model = new List;
        _this.listenTo(this.model, 'sync', _this.renderList);
        _this.renderTip();
        $(_this.templateTop).prependTo(_this.$el);
        return _this;
    },
    events: {
        'click .back-top':'backTop'
    },
    backTop:function(){
      var _this = this;
        _this.$el.scrollTop(0);
    },
    _scroll: function () {
        var _this = this;
        _this.$el.scroll(function () {
            /*
            * 向下翻页
            * */
            if (_this.$el.scrollTop() >= (_this.$el[0].scrollHeight - _this.$el.height())) {
                var page = parseInt(_this._getPage()) + 1;
                window.location.hash='list/'+ page;
            }
            /*
            * 向上翻页
            * */
            if (_this.$el.scrollTop() == 0) {
                _this._refresh()
            }
        })
    },
    _getPageList:function(){
        var list = this.$el.find('[data-page]');
        if (list.length > 3 ) {
            list[0].remove();
        }
        return list;
    },
    /*
    * 获取当前页的序列
    * */
    _getPage:function(){
        return this.model.get('current_page');
    },
    _refresh:function(){
        var crentPage = this._getPage();
        if (crentPage != 0) {
            this.pageList = [];
            this.$el.find('#listCont').html('');
            window.location.hash='list/'+ 0;
        }
    },
    pageList:[],
    fetch: function (p) {
        var _this = this;
        var p = p ? p : 0;
        if (_this.pageList.indexOf('list/'+p) >= 0) {
            /*
            * 假如是已经加载过的页面
            * */
        } else {
            /*
            * 未加载过的页面
            * */
            _this.model.fetch({data: {p: p},success:function(){
                _this.pageList.push('list/'+p);
            }});
        }
        _this.$el.addClass('list-show').siblings().removeClass('list-show');
    },
    renderTip: function () {
        var _this = this;
        $(_this.templateTip()).prependTo(_this.$el);
    },
    isFirst:true,
    renderList: function () {
        var _this = this;
        if (_this.el.innerHTML == '') {
            _this.$el.find('#listCont').html(_this.template(_this.model.toJSON()));
        } else {
            if (_this.$el.find('#list_'+ _this._getPage()).length>0) {
                _this.$el.find('#list_'+ _this._getPage()).html(_this.template(_this.model.toJSON()));
            } else {
                _this.$el.find('#listCont').append(_this.template(_this.model.toJSON()));
            }
        }
        /*
        * 渲染翻页
        * */
        _this.$el.find('#list-page').html(_this.template_page(_this.model.toJSON()));
        /*
        * 初次载入绑定滚动加载
        * */
        if (_this.isFirst) {
            _this.isFirst=false;
            _this._scroll();
        }
        return _this;
    }
});