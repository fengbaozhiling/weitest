define(function(){
    return function(){
        $('.za-nav > a').removeClass('on');
        var hash = location.hash;
        $('.za-nav > a[href="' + hash + '"]').addClass('on');
    };
});