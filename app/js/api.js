define(function (require) {
    var isService = require('config/config').server;

    return {

        /*
         * 用户列表
         * */
        'list': isService ? globConfig.host + 'index.php?s=/Weifans/index/lists' : demoConfig.host + 'lists',
        'socketHorn': isService ? globConfig.socketHorn : demoConfig.host,
        /*
         * 加好友，增加能量
         * */
        'addEnergy': isService ? globConfig.host + 'index.php?s=/Weifans/index/add_energy' : globConfig.host + 'index.php?s=/Weifans/index/add_energy',
        /*
         * 用户信息
         * */
        'userInfo': isService ? globConfig.host + 'index.php?s=/Weifans/index/user_info' : demoConfig.host + 'user_info',
        /*
         * 加入队列
         * */
        'queue': isService ? globConfig.host + 'index.php?s=/Weifans/index/queue' : globConfig.host + 'index.php?s=/Weifans/index/queue',
        /*
         * 销售记录
         * */
        'soldNote': isService ? globConfig.host + 'index.php?s=/Weifans/index/sold_note' : demoConfig.host + 'sold_note',
        /*
         * 徒弟列表
         * */
        'apprentices': isService ? globConfig.host + 'index.php?s=/Weifans/index/apprentices' : globConfig.host + 'index.php?s=/Weifans/index/apprentices',
        /*
         * 工具信息
         * */
        'tool': isService ? globConfig.host + 'index.php?s=/Weifans/index/tool' : globConfig.host + 'index.php?s=/Weifans/index/tool',
        /*
         * 上传二维码
         * */
        'uploadQrcode': isService ? globConfig.host + 'index.php?s=/Weifans/index/upload_qrcode' : globConfig.host + 'index.php?s=/Weifans/index/upload_qrcode',
        /*
         * 申请VIP
         * */
        'getVip': isService ? globConfig.host + 'index.php?s=/Weifans/index/get_vip' : globConfig.host + 'index.php?s=/Weifans/index/get_vip',
        /*
         * 获取二维码
         * */
        'getQrcode': isService ? globConfig.host + 'index.php?s=/Weifans/weixin/get_qrcode' : globConfig.host + 'index.php?s=/Weifans/weixin/get_qrcode',
        /*
         * 获取用户数
         * */
        'getFansCount': isService ? globConfig.host + '/index.php?s=/Weifans/Weixin/get_fans_count' : globConfig.host + '/index.php?s=/Weifans/Weixin/get_fans_count',
        /*
         * 二维码信息
         * */
        'perfectInfo': isService ? globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : globConfig.host + '/index.php?s=/Weifans/index/perfect_info',
        /*
        * 提现
        * */
        'withdraw': isService ? globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'withdraw',
        /*
        * 获取现金余额
        * */
        'cash':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'cash',
        /*
        * 提现记录
        * */
        'withdrawList':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'withdraw_list',

        'rank':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'rank',
        'official_accounts':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'official_accounts',
        'placard_rank':isService ?  globConfig.host + '/index.php?s=/Weifans/index/perfect_info' : demoConfig.host + 'placard_rank',
        'placard_cash': isService ?  globConfig.host + '/index.php?s=/Weifans/index/placard_cash' : demoConfig.host + 'placard_cash',
        /*
        * 接头暗号
        * */
        'secret_code': isService ?  globConfig.host + '/index.php?s=/Weifans/Weiplist/game_login' : demoConfig.host + 'secret_code'

    }
})
;