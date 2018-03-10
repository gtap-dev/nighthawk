'use strict';

const $          = global.jQuery;
const select     = require('select2')();
const storage    = require('../storage');
const events     = require('../events');

class Browser {

    constructor(el){

        const self = this;

        this._el   = $(el);
        this._tabs            = this._el.find('[data-role="tab"]');
        this._tabPanels       = this._el.find('[data-role="tab-panel"]');
        this._fileSwitcher    = this._el.find('[data-role="switcher"]');
        this._codeViews       = this._el.find('[data-role="code"]');
        this._resourcePreview = this._el.find('[data-role="resource-preview"]');
        this._activeClass     = 'is-active';
        this._initTabs();

        $(".FileBrowser-select").select2({
            minimumResultsForSearch: Infinity
        }).on('change', function(){
            $(this).closest('.FileBrowser').find('[data-role="resource-preview"]').removeClass(self._activeClass);
            $(`#${this.value}`).addClass(self._activeClass);
        });

        this._initFileSwitcher();
    }

    _initTabs() {
        const ac = this._activeClass;
        const tabs = this._tabs;
        tabs.on('click', e => {
            const link = $(e.target).closest('a');
            const tab = link.parent();
            tab.siblings().removeClass(ac);
            tab.addClass(ac);
            this._tabPanels.removeClass(ac);
            this._tabPanels.filter(link.attr('href')).addClass(ac);
            return false;
        });
    }

    _initFileSwitcher() {



    }

    // _initFileSwitcher() {
    //     const ac = this._activeClass;
    //     const switcher = this._fileSwitcher;
    //     const defaultSelected = storage.get(`browser.selectedCodeView`, 'code-html');
    //     switcher.on('change', e => {
    //         const selected = $(e.target).val();
    //         storage.set(`browser.selectedCodeView`, selected);
    //         this._codeViews.removeClass(ac);
    //         this._codeViews.filter(`#${selected}`).addClass(ac);
    //     });
    //     if (switcher.find(`option[value="${defaultSelected}"]`).length) {
    //         switcher.val(defaultSelected);
    //     }
    //     switcher.trigger('change');
    // }

}

module.exports = Browser;
