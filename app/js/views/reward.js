var doT = require('../../lib/dot/dot');
var dialog = require('../component/dialog/dialog');
var api = require('../api');
var FootBar = require('./footbar');
var RewardHead = require('./reward_head');
var UserModel = require('../models/user');
var SoldNote = require('../models/sold_note');
var tpl = require('html!../tpl/reward.html');

module.exports = Backbone.View.extend({
    el: '#rewardView',
    template: doT.template(tpl),
    tagName: 'div',
    events: {
        'click .pull-down': function(e) {
            var target = e.target;
            var targetBox = $(target).parents('.pull-down').attr('pannel');
            $(target).removeClass('alert-animate');
            if ($('[pannel-target='+ targetBox +']').hasClass('show')) {
                $('[pannel-target='+ targetBox +']').removeClass('show')
            } else {
                $('[pannel-target='+ targetBox +']').addClass('show');
            }

        },
        'click #drawMoney' : '_drawMoney'
    },
    _drawMoney:function() {
        window.location = '#withdraw';
    },
    initialize: function () {
        var _this = this;
        /*_this._drawMoney();*/
        _this.headView = {};
        _this.userInfo = new UserModel();
        _this.model = new SoldNote();
        _this.listenTo(_this.userInfo, 'sync', this._renderHead);
        _this.listenTo(_this.model, 'change', this.render);
    },
    _renderHead: function () {
        var _this = this;
        _this.headView.userInfo = _this.userInfo.toJSON();
        _this.headView.soldNote = _this.model.toJSON();
        var rewardHead = new RewardHead();
        _this.$el.find('#headView').html(rewardHead.template(_this.headView));
    },
    render: function () {
        var footBar = new FootBar();
        var _this = this;
        _this.$el.addClass('block')
        _this.$el.siblings().removeClass('block');
        _this.$el.find('#recordView').html(_this.template(_this.model.toJSON()));
        _this.$el.append(footBar.render().template());
        footBar.footBarCrent('.footer-bar a');
        return this;
    }
});