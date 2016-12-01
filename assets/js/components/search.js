var $input = jQuery('#search-input');
var ul = jQuery('#searchid ul' )[0];

$input.on('keyup',function () {
    var filter = this.value.toUpperCase();
    search(ul,filter);
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
