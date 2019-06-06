'use strict';

const storage    = require('../storage');

class Settings {

    constructor(el){

        const self = this;

        this._el                = $(el);
        this._simpleToggleState = storage.get(`settings.simpleToggle`, false);
        this._simpleToggle      = this._el.find('[data-role="simple-ui"]');
        this._simpleClass       = 'has-simple-ui';

        this._iconTestToggleState = storage.get(`settings.iconTest`, false);
        this._iconTestToggle      = this._el.find('[data-role="test-icons"]');
        this._iconTestClass       = 'is-icon-test-active';

        this._init();
    }

    _init() {
        this._simpleToggle.on('change', (event) => {
            const _self = $(event.currentTarget);

            if (_self.is(':checked') ) {
                $('body').addClass(this._simpleClass);
                storage.set(`settings.simpleToggle`, true);
            } else {
                $('body').removeClass(this._simpleClass);
                storage.set(`settings.simpleToggle`, false);
            }
        });

        if (this._simpleToggleState) {
            this._simpleToggle.prop('checked', true).trigger('change');
        }

        this._iconTestToggle.on('change', (event) => {
            const _self = $(event.currentTarget);

            if (_self.is(':checked') ) {
                $('body').addClass(this._iconTestClass);
                storage.set(`settings.iconTest`, true);
            } else {
                $('body').removeClass(this._iconTestClass);
                storage.set(`settings.iconTest`, false);
            }
        });

        if (this._iconTestToggleState) {
            this._iconTestToggle.prop('checked', true).trigger('change');
        }
    }
}

module.exports = Settings;
