'use strict';

const $ = global.jQuery;
const Preview    = require('./preview');
const Browser    = require('./browser');

require('jquery-resizable-dom');

class Pen {

    constructor(el){
        this._el             = $(el);
        this._id             = this._el[0].id;
        this._previewPanel   = this._el.find('[data-behaviour="preview"]');
        this._browser        = this._el.find('[data-behaviour="browser"]');
        this._handle         = this._el.children('[data-role="resize-handle"]');
        this._init();
    }

    _init() {
        let browsers        = [];
        let previews        = [];

        for(let i = 0; i < this._browser.length; i++) {
            browsers.push(new Browser(this._browser[i]));
        }

        for(let i = 0; i < this._previewPanel.length; i++) {
            previews.push(new Preview(this._previewPanel[i]));
        }
    }
}

module.exports = Pen;
