var appCache = require('./appCache');
var Pay = require('./views/pay');
var Welcome = require('./views/welcome');
var Reward = require('./views/reward');
var RewardRules = require('./views/reward_rules');
var JcView = require('./views/jiaochen');
var JcQcView = require('./views/jiaochen_qcode');
var ListView = require('./views/list');
var ToolView = require('./views/tool');
var ToolDetailView = require('./views/tool_detail');
var IndexView = require('./views/index');
var Qcode = require('./views/qcode');
var Withdraw = require('./views/withdraw');
var QcodeUpload = require('./views/qcode_upload');
var ApprenticesView = require('./views/apprentices');
var ChatView = require('./views/chat');
var MenuView = require('./views/menu');
var WithdrawList = require('./views/withdraw_list');
var RankView = require('./views/rank');
var OfficialAccounts = require('./views/official_accounts');
var OfficialAccountsDtail = require('./views/official_accounts_detail');
var PlacardView = require('./views/placard');
var PlacardWelcomeView = require('./views/placard_welcome');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'list',
        'index': 'list',
        'welcome': 'welcome',
        'pay': 'pay',
        'list': 'list',
        'reward': 'reward',
        'reward/:page': 'reward',
        'reward_rules': 'rewardRules',
        'jiaochen': 'jiaochen',
        'jiaochen/qcode': 'jiaochenQcode',
        'qcode': 'qcode',
        'tool': 'tool',
        'tool/:id': 'toolDetail',
        'apprentices': 'apprentices',
        'apprentices/:page': 'apprentices',
        'qcode_upload': 'qcodeUpload',
        'chat': 'chat',
        'withdraw': 'withdraw',
        'withdraw/:type': 'withdraw',
        'withdraw_list': 'withdraw_list',
        'withdraw_list/:page': 'withdraw_list',
        'rank': 'rank',
        'rank/:period': 'rank',
        'official_accounts': 'officialAccounts',
        'official_accounts/:id': 'officialAccountsDetail',
        'placard':'placard',
        'placard/:group':'placard',
        'placard_welcome':'placardWelcome'
    },
    cacheInitialize: function () {
        appCache.initialize(function () {
            var view = {};
            view.welcomeView = new Welcome;
            view.payView = new Pay;
            view.rewardView = new Reward;
            view.rewardRulesView = new RewardRules;
            view.listView = new ListView;
            view.jcView = new JcView;
            view.jcQcView = new JcQcView;
            view.qcode = new Qcode;
            view.qcodeUpload = new QcodeUpload;
            view.toolView = new ToolView;
            view.withdraw = new Withdraw;
            view.indexView = new IndexView;
            view.apprenticesView = new ApprenticesView;
            view.chatView = new ChatView;
            view.menuView = new MenuView;
            view.withdrawList = new WithdrawList;
            view.toolDetailView = new ToolDetailView;
            view.rankView = new RankView;
            view.officialAccountsView = new OfficialAccounts;
            view.officialAccountsDtail = new OfficialAccountsDtail;
            view.placardView = new PlacardView;
            view.placardWelcome = new PlacardWelcomeView;

            return view;
        });
        this.cached = appCache.get();
    },
    initialize: function () {
        this.cacheInitialize();
    },
    index: function () {
        this.cached.indexView.render();
        this.cached.indexView.$el.addClass('block').siblings().removeClass('block');
    },
    placard:function(group){
        var group = group ? group : 'myteam';
        this.cached.placardView.placardModel.fetch({data:{group:group}});
        this.cached.placardView.cashModel.fetch();
        this.cached.placardView.$el.addClass('block').siblings().removeClass('block');
    },
    placardWelcome:function(){
        this.cached.placardWelcome.render();
        this.cached.placardWelcome.$el.addClass('block').siblings().removeClass('block');
    },
    officialAccounts: function () {
        this.cached.officialAccountsView.render();
        this.cached.officialAccountsView.model.fetch();
        this.cached.officialAccountsView.$el.addClass('block').siblings().removeClass('block');
    },
    officialAccountsDetail:function() {
        this.cached.officialAccountsDtail.parent = this.cached.officialAccountsView;
        this.cached.officialAccountsDtail.render();
    },
    rank: function (period) {
        var period = period ? period : 'all';
        this.cached.rankView.rankModel.fetch({data: {period: period}});
        this.cached.rankView.render();
        this.cached.rankView.$el.addClass('block').siblings().removeClass('block');

    },
    welcome: function () {
        this.cached.welcomeView.render();
        this.cached.welcomeView.$el.addClass('block').siblings().removeClass('block');
    },
    withdraw: function (type) {
        var type = type ? type : 2;
        this.cached.withdraw.cashModel.fetch({data: {type: type}});
        this.cached.withdraw.render();
        this.cached.withdraw.$el.addClass('block').siblings().removeClass('block');

    },
    withdraw_list: function (page) {
        var page = page ? page : 1;
        this.cached.withdrawList.withModel.fetch({data: {p: page}});
        this.cached.withdrawList.$el.addClass('block').siblings().removeClass('block');
    },
    pay: function () {
        this.cached.payView.render();
        this.cached.payView.$el.addClass('block').siblings().removeClass('block');
    },
    reward: function (page) {
        var page = page ? page : 1;
        this.cached.rewardView.model.fetch({data: {p: page}});
        this.cached.rewardView.render();
        this.cached.rewardView.userInfo.fetch();
        this.cached.rewardView.$el.addClass('block').siblings().removeClass('block');
    },
    rewardRules: function () {
        this.cached.rewardRulesView.render();
        this.cached.rewardRulesView.$el.addClass('block').siblings().removeClass('block');
    },
    list: function () {
        this.cached.listView.model.fetch();
        this.cached.listView.userInfo.fetch();
        this.cached.listView.$el.addClass('block').siblings().removeClass('block');
        this.cached.menuView.render();
    },
    jiaochen: function () {
        this.cached.jcView.render();
        this.cached.jcView.$el.addClass('block').siblings().removeClass('block');
    },
    jiaochenQcode: function () {
        this.cached.jcQcView.render();
        this.cached.jcQcView.$el.addClass('block').siblings().removeClass('block');
    },
    qcode: function () {
        this.cached.qcode.render();
        this.cached.qcode.model.fetch();
        this.cached.qcode.$el.addClass('block').siblings().removeClass('block');
    },
    qcodeUpload: function () {
        this.cached.qcodeUpload.model.fetch();
        this.cached.qcodeUpload.$el.addClass('block').siblings().removeClass('block');
    },
    tool: function () {
        this.cached.toolView.render();
        this.cached.toolView.$el.addClass('block').siblings().removeClass('block');
    },
    toolDetail: function (id) {
        this.cached.toolDetailView.$el.empty();
        this.cached.toolDetailView.render();
        this.cached.toolDetailView.model.fetch({data: {id: id}});
        this.cached.toolDetailView.$el.addClass('block').siblings().removeClass('block');
    },
    apprentices: function (page) {
        var page = page ? page : 1;
        this.cached.apprenticesView.render();
        this.cached.apprenticesView.model.fetch({data: {p: page}});
        this.cached.apprenticesView.$el.addClass('block').siblings().removeClass('block');
    },
    chat: function () {
        this.cached.chatView.render();
        this.cached.chatView.$el.addClass('block').siblings().removeClass('block');
    }
});
