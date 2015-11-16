define(function () {
    'use strict';
    var dismiss = '[data-dismiss="alert"]';
    var Alert = function (el) {
        $(el).on('click', dismiss, this.close)
    };

    Alert.VERSION = '3.3.5';

    Alert.TRANSITION_DURATION = 150;

    Alert.prototype.close = function (e) {
        var $this = $(this);
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') ;// strip for ie7
        }

        var $parent = $(selector);

        if (e) e.preventDefault();

        if (!$parent.length) {
            $parent = $this.closest('.za-alert')
        }

        $parent.trigger(e = $.Event('close.bs.alert'));

        if (e.isDefaultPrevented()) return;

        $parent.removeClass('in');

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement()
    };


    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
    // ALERT DATA-API
    // ==============
    return Alert
})
