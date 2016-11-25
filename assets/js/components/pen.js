'use strict';

const $          = global.jQuery;
const storage    = require('../storage');
const events     = require('../events');
const Preview    = require('./preview');
const Browser    = require('./browser');
const resizeable = require('jquery-resizable-dom/dist/jquery-resizable.js');

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
        const initialHeight = storage.get(`pen.previewHeight`, (this._el.outerHeight() / 2));
        const preview       = new Preview(this._previewPanel);
        const browser       = new Browser(this._browser);
        let state           = storage.get(`pen.previewState`, 'open');
        let handleClicks    = 0;
        let dblClick        = false;
        const that          = this;

        if (state === 'open') {
            this._previewPanel.outerHeight(initialHeight);
            storage.set(`pen.previewHeight`, initialHeight);
        } else {
            this._previewPanel.css('height', '100%');
        }

        this._handle.on('mousedown', e => {
            dblClick = false;
            handleClicks++;

            setTimeout(function() {
                handleClicks = 0;
            }, 400);

            if (handleClicks === 2) {
                dblClick = true;
                handleClicks = 0;
                return false;
            }
        });

        this._previewPanel.resizable({
            handleSelector: this._handle,
            resizeWidth: false,
            onDragStart: () => {
                this._el.addClass('is-resizing');
                preview.disableEvents();
                events.trigger('start-dragging');
            },
            onDragEnd: () => {
                this._el.removeClass('is-resizing');
                preview.enableEvents();
                events.trigger('end-dragging');
                if (dblClick) {
                    if (state === 'closed') {
                        this._previewPanel.css('height', storage.get(`pen.onClosedHeight`, initialHeight));
                        state = 'open';
                        storage.set(`pen.previewState`, 'open');
                    } else {
                        storage.set(`pen.onClosedHeight`, this._previewPanel.outerHeight());
                        this._previewPanel.css({
                            'height': '100%',
                            'transition': '.3s ease all'
                        });
                        state = 'closed';
                        storage.set(`pen.previewState`, 'closed');
                    }
                } else {
                    if (state !== 'closed') {
                        storage.set(`pen.previewHeight`, this._previewPanel.outerHeight());
                    } else {
                        setTimeout(() => {
                            if (!dblClick) {
                                state = 'open';
                                storage.set(`pen.previewState`, 'open');
                                storage.set(`pen.previewHeight`, this._previewPanel.outerHeight());
                            }
                        }, 400);
                    }
                }
            }
        });

        const btn = $('#js-copyHtml');
        btn.on('click', function(e) {
            e.preventDefault();
            copyHtml(getHtml());
        });

        function getHtml() {
            let copyHtml;
            that._browser.children().each(function () {
                const $this = $(this);
                let str = $this[0].id;

                str = str.substring(str.length - 4, str.length);

                if (str === 'html') {
                    const $html = $($this.text()).clone();

                    let child;
                    if ($html.hasClass('sg-collator')) {
                        child = $html.children()[1];
                    } else {
                        child = $html;
                    }

                    const svg = $(child).find('svg');

                    if (svg.length && localStorage.getItem('iconPath')) {
                        const svgUse = $(svg).find('use')
                        const split = svgUse.attr('xlink:href').split('#');
                        const iconName = split[1];

                        const iconPath = localStorage.getItem('iconPath') + '#' + iconName;
                        svgUse.attr('xlink:href', iconPath);
                    }

                    copyHtml = $(child)[0].outerHTML;
                }
            });

            return copyHtml;
        }

        function copyHtml(text) {
            function selectElementText(element) {
                if (document.selection) {
                    let range = document.body.createTextRange();
                    range.moveToElementText(element);
                    range.select();
                } else if (window.getSelection) {
                    let range = document.createRange();
                    range.selectNode(element);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                }
            }
            let element = document.createElement('DIV');
            element.textContent = text;
            document.body.appendChild(element);
            selectElementText(element);
            if (document.execCommand('copy')) {
                console.log('success');
            }
            element.remove();
        }
    }
}

module.exports = Pen;
