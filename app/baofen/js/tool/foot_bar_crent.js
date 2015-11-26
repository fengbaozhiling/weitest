module.exports = function(el){
    var hash = location.hash;

    $(el).removeClass('on');
    if ($(el).attr('href')) {
        $(el).filter('[href="'+ hash +'"]').addClass('on');
    } else  {
        $(el).filter('[nav="'+ hash +'"]').addClass('on');
    }
    if ($(el).filter('.on').length == 0) {
        $(el).eq(0).addClass('on')
    }
};