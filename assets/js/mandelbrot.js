'use strict';

require('jquery');
require('core-js/features/symbol');
require('core-js/features/symbol/iterator');
require('core-js/features/array/includes');

require('jquery-pjax');

const $ = global.jQuery;
const doc        = $(document);
const frctl      = window.frctl || {};

const events     = require('./events');
const utils      = require('./utils');
const framer     = require('./components/frame');
const Tree       = require('./components/tree');
const Pen        = require('./components/pen');
const Settings   = require('./components/settings');

global.fractal = {
    events: events
};

const frame     = framer($('#frame'));

$.map($('[data-behaviour="tree"]'), t => new Tree(t));
$.map($('[data-behaviour="settings"]'), s => new Settings(s));

loadPen();

if (frctl.env == 'server') {
    doc.pjax('a[data-pjax], code a[href], .Prose a[href]:not([data-no-pjax]), .Browser a[href]:not([data-no-pjax])', '#pjax-container', {
        fragment: '#pjax-container',
        timeout: 10000
    }).on('pjax:start', function(e, xhr, options){
        if (utils.isSmallScreen()) {
            frame.closeSidebar();
        }
        frame.startLoad();
        events.trigger('main-content-preload', options.url);
    }).on('pjax:end', function(){
        events.trigger('main-content-loaded');
        frame.endLoad();
    });
}

events.on('main-content-loaded', loadPen);

function loadPen(){
    setTimeout(function(){
        $.map($('[data-behaviour="pen"]'), p => new Pen(p));
    }, 1);
}
