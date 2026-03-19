'use strict';

const $       = global.jQuery;
const storage = require('../storage');
const events  = require('../events');

const STORAGE_KEY      = 'styleguide-themes';
const THEME_CLONE_ATTR = 'data-theme-clone';

class Themes {

    constructor(el) {
        this._el         = $(el);
        this._input      = this._el.find('[data-role="theme-input"]');
        this._addBtn     = this._el.find('[data-role="theme-add"]');
        this._list       = this._el.find('[data-role="theme-list"]');

        // Config themes come from fractal.config.js (shared via git)
        this._configThemes = this._getConfigThemes();

        // Local themes are user-added extras stored in localStorage
        this._localThemes = this._getLocalThemes();

        this._init();
    }

    _init() {
        this._renderList();
        this._bindAddEvents();
        this._duplicatePreviews();

        // Re-run duplication after pjax navigation
        events.on('main-content-loaded', () => {
            this._duplicatePreviews();
        });
    }

    // ─── Merged theme list ─────────────────────────────────────────────

    _getAllThemes() {
        // Config themes first, then any local extras that aren't duplicates
        const all = [...this._configThemes];
        this._localThemes.forEach(t => {
            if (!all.includes(t)) all.push(t);
        });
        return all;
    }

    // ─── Config themes (from fractal.config.js) ───────────────────────

    _getConfigThemes() {
        try {
            const raw = this._el.attr('data-config-themes');
            const parsed = JSON.parse(raw || '[]');
            return Array.isArray(parsed) ? parsed.map(t => String(t).trim().toLowerCase()).filter(Boolean) : [];
        } catch (e) {
            return [];
        }
    }

    // ─── Local themes (localStorage extras) ───────────────────────────

    _getLocalThemes() {
        return storage.get(STORAGE_KEY, []);
    }

    _saveLocalThemes() {
        storage.set(STORAGE_KEY, this._localThemes);
    }

    _addLocalTheme(name) {
        name = name.trim().toLowerCase();
        if (!name || this._configThemes.includes(name) || this._localThemes.includes(name)) return false;
        this._localThemes.push(name);
        this._saveLocalThemes();
        return true;
    }

    _removeLocalTheme(name) {
        this._localThemes = this._localThemes.filter(t => t !== name);
        this._saveLocalThemes();
    }

    // ─── Settings UI ───────────────────────────────────────────────────

    _bindAddEvents() {
        this._addBtn.on('click', () => this._handleAdd());
        this._input.on('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this._handleAdd();
            }
        });
    }

    _handleAdd() {
        const val = this._input.val();
        if (this._addLocalTheme(val)) {
            this._input.val('');
            this._renderList();
            this._duplicatePreviews();
        }
    }

    _renderList() {
        this._list.empty();

        const allThemes = this._getAllThemes();

        if (allThemes.length === 0) {
            this._list.append('<div class="Themes-empty">No themes configured</div>');
            return;
        }

        allThemes.forEach(name => {
            const isConfig = this._configThemes.includes(name);

            const $item = $(`
                <div class="Themes-item">
                    <span class="Themes-itemName">${name}</span>
                    ${isConfig
                        ? '<span class="Themes-itemBadge">config</span>'
                        : `<button class="Themes-itemRemove" data-theme-remove="${name}" title="Remove theme">&times;</button>`
                    }
                </div>
            `);

            if (!isConfig) {
                $item.find('[data-theme-remove]').on('click', () => {
                    this._removeLocalTheme(name);
                    this._renderList();
                    this._duplicatePreviews();
                });
            }

            this._list.append($item);
        });
    }

    // ─── Preview Duplication ───────────────────────────────────────────

    _duplicatePreviews() {
        // Remove previously cloned theme wrappers and labels
        $(`[${THEME_CLONE_ATTR}]`).remove();
        $('.Themes-label').remove();

        const themes = this._getAllThemes();
        if (themes.length === 0) return;

        // Find all original Preview-wrapper elements
        const $wrappers = $('.Preview-wrapper').not(`[${THEME_CLONE_ATTR}]`);

        $wrappers.each((_, wrapper) => {
            const $wrapper = $(wrapper);
            const $preview = $wrapper.closest('.Preview');
            const $iframe  = $wrapper.find('.Preview-iframe');

            if (!$iframe.length) return;

            const baseSrc = $iframe.attr('src');
            if (!baseSrc) return;

            // Add "default" label to the original wrapper
            $wrapper.before('<div class="Themes-label Themes-label--default">default</div>');

            themes.forEach(themeName => {
                // Build themed URL
                const separator = baseSrc.includes('?') ? '&' : '?';
                const themedSrc = baseSrc + separator + 'theme=' + encodeURIComponent(themeName);

                // Clone the wrapper
                const $clone = $wrapper.clone();
                $clone.attr(THEME_CLONE_ATTR, themeName);

                // Update iframe src in the clone
                $clone.find('.Preview-iframe').attr('src', themedSrc);

                // Create a label
                const $label = $(`<div class="Themes-label">${themeName}</div>`);

                // Insert after the last element in the preview panel
                $preview.append($label, $clone);
            });
        });
    }
}

module.exports = Themes;
