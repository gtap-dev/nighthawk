
'use strict';

const $ = global.jQuery;
const Tree = require('./tree');
const Search = require('./search');
const Settings = require('./settings');

class Navigation {
    constructor(el) {
        this._el = $(el);
        this.navTrees = $.map(this._el.find('[data-behaviour="tree"]'), (t) => new Tree(t));
        $.map(this._el.find('[data-behaviour="search"]'), (s) => new Search(s, this.navTrees));
        $.map(this._el.find('[data-behaviour="settings"]'), s => new Settings(s));
    }
}

module.exports = Navigation;
