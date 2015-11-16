'use strict';

define([
    'doT',
    'dialog',
    'models/placard_rank',
    'models/placard_cash',
    'tool/foot_bar_crent',
    'text!tpl/placard.html',
    'text!tpl/placard_rank.html'
], function ( doT,dialog, PlacardRank, Cash, footBarCrent, tpl, tplRank) {
    return Backbone.View.extend({
        el: $('#placardView'),
        template: doT.template(tpl),
        templateRank:doT.template(tplRank),
        tagName: 'div',
        events:{
          'click .icon-wenhao': function() {
              var html = '<div class="alert-out alert-out-info">' +
                  '<span class="text-danger">若可提现金额小于提现额度不能提现</span><br>1、必须满足积分超过100分，即最低1元方可提现；<br>2、推广的好友关注公众号即可获得一个积分红包；<br>3、可提现结算周期为24小时，即指第二次提现申请与第一次提现申请需间隔24小时；<br>4、您可自主提现，提现金额转到微信零钱；<br>5、爆粉大师拥有本活动最终解释权' +
                  '</div>';
              var d = new dialog ({
                  title:'积分说明',
                  content:html,
                  ok:function(){
                      d.close();
                  }
              })
          }
        },
        initialize: function () {
            var _this = this;
            _this.placardModel = new PlacardRank;
            _this.cashModel  = new Cash;
            _this.listenTo(_this.placardModel, 'sync', this._renderRank);
            _this.listenTo(_this.cashModel, 'sync', this.render);
        },
        _renderRank:function(){
          var _this = this;
            _this.$el.find('.rankView').html(_this.templateRank(_this.placardModel.toJSON()));
            footBarCrent('.za-nav a');
        },
        render: function () {
            var _this = this;
            _this.$el.find('.bannerView').html(_this.template(_this.cashModel.toJSON()));
            return this;
        }
    });

});
