(function ( $ ) {

    $.fn.mdlModalDialog = function(options) {
        options = $.extend({
            id: 'orrsDiag',
            title: null,
            neutral: false,
            negative: false,
            positive: false,
            cancelable: true,
            contentStyle: null,
            onLoaded: false,
            onHidden: false,
            hideOther: true
        }, options);

        var originalElement = {
            el: this,
            parent: this.parent(),
            index: this.parent().children().index( this ),
            originalCss: this.attr('style')
        };

        if (options.hideOther) {
            // remove existing dialogs
            $('.dialog-container').remove();
            $(document).unbind("keyup.dialog");
        }

        $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
        var dialog = $('#' + options.id);
        var content = dialog.find('.mdl-card');
        if (options.contentStyle != null) content.css(options.contentStyle);
        if (options.title != null) {
            $('<h5>' + options.title + '</h5>').appendTo(content);
        }

        this.css('display', '').appendTo($('<p>')).appendTo(content);

        if (options.neutral || options.negative || options.positive) {
            var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
            if (options.neutral) {
                options.neutral = $.extend({
                    id: 'neutral',
                    title: 'Neutral',
                    onClick: null
                }, options.neutral);
                var neuButton = $('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.neutral.id + '">' + options.neutral.title + '</button>');
                neuButton.click(function (e) {
                    e.preventDefault();
                    if (options.neutral.onClick == null || !options.neutral.onClick(e))
                        hideDialog(dialog, options.onHidden, originalElement)
                });
                neuButton.appendTo(buttonBar);
            }
            if (options.negative) {
                options.negative = $.extend({
                    id: 'negative',
                    title: 'Cancel',
                    onClick: null
                }, options.negative);
                var negButton = $('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.negative.id + '">' + options.negative.title + '</button>');
                negButton.click(function (e) {
                    e.preventDefault();
                    if (options.negative.onClick == null || !options.negative.onClick(e))
                        hideDialog(dialog, options.onHidden, originalElement)
                });
                negButton.appendTo(buttonBar);
            }
            if (options.positive) {
                options.positive = $.extend({
                    id: 'positive',
                    title: 'OK',
                    onClick: null
                }, options.positive);
                var posButton = $('<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="' + options.positive.id + '">' + options.positive.title + '</button>');
                posButton.click(function (e) {
                    e.preventDefault();
                    if (options.positive.onClick == null || !options.positive.onClick(e))
                        hideDialog(dialog, options.onHidden, originalElement)
                });
                posButton.appendTo(buttonBar);
            }
            buttonBar.appendTo(content);
        }
        componentHandler.upgradeDom();
        if (options.cancelable) {
            dialog.click(function () {
                hideDialog(dialog, options.onHidden, originalElement);
            });
            $(document).bind("keyup.dialog", function (e) {
                if (e.which == 27)
                    hideDialog(dialog, options.onHidden, originalElement);
            });
            content.click(function (e) {
                e.stopPropagation();
            });
        }
        setTimeout(function () {
            dialog.css({opacity: 1});
            if (options.onLoaded)
                options.onLoaded();
        }, 1);

        return this;
    }

    function hideDialog(dialog, callback, originalElement) {
        $(document).unbind("keyup.dialog");
        dialog.css({opacity: 0});
        setTimeout(function () {
            dialog.detach();

            var next = originalElement.parent.children().eq( originalElement.index );

            // Don't try to place the dialog next to itself (#8613)
            if ( next.length && next[ 0 ] !== originalElement.el ) {
                next.before( originalElement.el  );
            } else {
                originalElement.parent.append( originalElement.el  );
            }

            originalElement.el.attr('style', originalElement.originalCss);
            dialog.remove();

            if (callback)
                callback();
        }, 400);
    }
}( jQuery ));
