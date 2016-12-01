var $input = jQuery('#search-input');
var ul = jQuery('#searchid ul' )[0];

$input.on('keyup focus blur change',function () {
    var filter = this.value.toUpperCase();
    search(ul,filter);
    check(jQuery(this));
});

function search(list,key) {
    var i, li = jQuery(list).children('li');
    var match = false;
    for (i = 0; i < li.length; i++) {
        var $li = jQuery(li[i]);
        var childTree = jQuery(li[i]).children('ul');

        if (($li.text().toUpperCase().indexOf(key) !== -1) || ($li.find('[data-tags]').attr('data-tags').toUpperCase().indexOf(key) !== -1)) {
            match = true;
            jQuery($li.find('.Tree-collectionLabel span')[0]).trigger('click');
            $li.show();
            search(childTree, key);
        } else {
            match = false;
            $li.hide();
        }
    }
    return match;
}

function check($input) {
    var hasClearButton = $input.parent().find('.form-textfield__icon--clear').length > 0;
    var visibleClass = 'is-visible';
    var $btn;

    //if button doesn't exist
    if (!hasClearButton) {
        //make new button
        var btnHTML = '<a href="javascript:void(0)" class="form-textfield__icon form-textfield__icon--clear">' + '<svg class="icon " viewBox="0 0 32 32">' + '<path d="M26.958 4.733c-6.138-6.138-16.090-6.138-22.235 0.007-6.138 6.138-6.138 16.090 0 22.227s16.090 6.138 22.227 0c6.145-6.145 6.145-16.097 0.008-22.234zM12.461 9.147l3.246 3.246 3.246-3.246c0.793-0.793 2.091-0.793 2.885 0l0.721 0.721c0.793 0.793 0.793 2.091 0 2.885l-3.246 3.246 3.246 3.246c0.793 0.793 0.793 2.091 0 2.885l-0.721 0.722c-0.793 0.793-2.091 0.793-2.885 0l-3.246-3.246-3.246 3.246c-0.793 0.793-2.091 0.793-2.885 0l-0.721-0.721c-0.793-0.793-0.793-2.091 0-2.885l3.246-3.246-3.245-3.245c-0.793-0.793-0.793-2.091 0-2.885l0.721-0.721c0.793-0.794 2.091-0.794 2.884-0.001z"></path>' + '</svg>' + '</a>';
        //insert
        $btn = jQuery(btnHTML);
        $btn.insertAfter($input);

        hasClearButton = true;

        //Button events
        $btn.click(function() {
            $input.val('');
            check($input);
            $input.focus();
        });
    } else {
        $btn = $input.parent().find('.form-textfield__icon--clear');
    }

    var visible = false;
    var $target = $input;

    if ($target.val() || $target.val() != '') {
        //show button
        visible = true;
    }

    if (visible) {
        $btn.addClass(visibleClass);
    } else {
        $btn.removeClass(visibleClass);
    }
}
