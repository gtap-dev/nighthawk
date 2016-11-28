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
        let browsers        = [];
        let previews        = [];
        let state           = storage.get(`pen.previewState`, 'open');
        let handleClicks    = 0;
        let dblClick        = false;
        const that          = this;

        for(let i = 0; i < this._browser.length; i++) {
            browsers.push(new Browser(this._browser[i]));
        }

        for(let i = 0; i < this._previewPanel.length; i++) {
            previews.push(new Preview(this._previewPanel[i]));
        }
        this._previewPanel.css('height', '600px');

        const btn = $('.js-copyHtml');
        let $thisBtn;
        btn.on('click', function(e) {
            $thisBtn = $(this);
            e.preventDefault();
            copyHtml(getHtml(this));
        });

        function getHtml(btn) {
            const $btn = $(btn);
            const btnParentId = $btn.parent().parent()[0].id;
            let copyHtml = '<div>You got nothing</div>';

            that._browser.children().each(function () {
                const $this = $(this);
                let str = $this[0].id;
                const thisId = str.substring(0, 40);

                if (thisId === btnParentId) {
                    str = str.substring(str.length - 4, str.length);

                    if (str === 'html') {
                        const $html = $($this.text()).clone();
                        const svg = $html.find('svg');

                        if (svg.length && localStorage.getItem('iconPath')) {
                            const svgUse = $(svg).find('use')
                            const split = svgUse.attr('xlink:href').split('#');
                            const iconName = split[1];

                            const iconPath = localStorage.getItem('iconPath') + '#' + iconName;
                            svgUse.attr('xlink:href', iconPath);
                        }

                        copyHtml = $html[0].outerHTML;
                    }
                }
            });

            return copyHtml;
        }

        function copyHtml(html) {
            let element = document.createElement('textarea');
            element.textContent = html;
            document.body.appendChild(element);
            element.select();

            if (document.execCommand('copy')) {
                showNotification('success');
            } else {
                showNotification('error');
            }

            element.remove();
        }

        function showNotification(state) {
            switch (state) {
                case 'success':
                    $thisBtn.removeClass('btn--variant-dark').addClass('btn--order');
                    $thisBtn.text('Copied!');
                    $thisBtn.blur();
                    window.setTimeout(function() {
                        $thisBtn.removeClass('btn--order').addClass('btn--variant-dark');
                        $thisBtn.text('Copy');
                    }, 3000);
                    break;
                case 'error':
                    $thisBtn.removeClass('btn--variant-dark').addClass('btn--quit');
                    $thisBtn.text('Error occurred');
                    window.setTimeout(function() {
                        $thisBtn.removeClass('btn--quit').addClass('btn--variant-dark');
                        $thisBtn.text('Copy');
                    }, 5000);
                    break;
            }
        }
    }
}

module.exports = Pen;
