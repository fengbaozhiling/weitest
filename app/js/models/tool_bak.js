var api = require('../api');
module.exports =  Backbone.Model.extend({
    defaults: function () {
        return {
            1: {
                name:'微信多开工具',
                adapt:'Android用户',
                intro:'安卓5.4多开，需先下载安装【微养号】（注意微养号只是辅助软件，下载安装好了不用打开它，但一定要安装。',
                tips:'本文中涉及的软件来自第三方，顶呱呱不对软件的安全性负责，请用户自行判断是否需要进行安装！',
                down:{
                    1:{
                        url:'http://fir.im/jytk',
                        name:'微养号下载地址',
                        password:0
                    },
                    2:{
                        url:'http://fir.im/sg3u',
                        enter:'微信多开工具下载地址',
                        password:0
                    }
                }
            },
            2: {
                name:'自动杀死粉',
                adapt:'Microsoft Windows系统',
                intro:'顾名思义，简单几步即可“杀死”粉丝，不要犹豫了~在电脑端输入以下地址，即可下载该工具',
                tips:'本文中涉及的软件来自第三方，爆粉大师不对软件的安全性负责，请用户自行判断是否需要进行安装！',
                down:{
                    1:{
                        url:'http://pan.baidu.com/s/1kTH9iOf',
                        enter:'百度网盘',
                        password:'drv4'
                    }
                }
            },
            3: {
                name:'自动抢红包',
                adapt:'Android用户',
                intro:'怪不得老是抢不到红包，原来他们作弊！！',
                tips:'本文中涉及的软件来自第三方，本站不对软件的安全性负责，请用户自行判断是否需要进行安装！(苹果iOS用户:前提条件：需要越狱后, cydia添加源 http://apt.so/xuanshao,搜索-红包-安装-桌面红包软件自行设置.步骤：打开cydia.点击软件源，编辑，添加，输入 http://apt.so/xuanshao然后返回后搜索红包，安装红包猎手.重启后打开红包猎手设置一下.返回微信便可自动抢红包. )',
                down:{
                    1:{
                        url:'http://2.pipititi.com/150120/?from=singlemessage&isappinstalled=0',
                        enter:'本地下载地址',
                        password:'drv4'
                    }
                }
            },
            4: {
                name:'装逼神器',
                adapt:'所有人群',
                intro:'',
                tips:'本文中涉及的软件来自第三方，本站不对软件的安全性负责，请用户自行判断是否需要进行安装！(苹果iOS用户:前提条件：需要越狱后, cydia添加源 http://apt.so/xuanshao,搜索-红包-安装-桌面红包软件自行设置.步骤：打开cydia.点击软件源，编辑，添加，输入 http://apt.so/xuanshao然后返回后搜索红包，安装红包猎手.重启后打开红包猎手设置一下.返回微信便可自动抢红包. )',
                down:{
                    1:{
                        url:'http://baozoumanhua.com/zhuangbi/list',
                        enter:'入口地址',
                        password:0
                    }
                }
            }
        }
    },
    initialize: function () {
        return this;
    },
    url: api.tool
});