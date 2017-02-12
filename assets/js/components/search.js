var $input = jQuery('#search-input');
var ul = jQuery('#searchid ul' )[0];

$input.on('keyup blur change',function () {
    var filter = this.value.toUpperCase();
    search(ul,filter);
});

function search(list,key) {
    var i, li = jQuery(list).children('li');
    var match = false;
    for (i = 0; i < li.length; i++) {
        var $li = jQuery(li[i]);
        var childTree = jQuery(li[i]).children('ul');

        if ( $li.parents('.Tree-collection').find('> .Tree-collectionLabel').text().toUpperCase().indexOf(key) !== -1 || ($li.text().toUpperCase().indexOf(key) !== -1) || ($li.find('[data-tags]').attr('data-tags').toUpperCase().indexOf(key) !== -1) ) {
            match = true;
            $li.parents('.Tree-collection').removeClass('is-closed');
            $li.show();
            search(childTree, key);
        } else {
            match = false;
            $li.hide();
        }
    }
    return match;
}
