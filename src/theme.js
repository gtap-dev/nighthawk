'use strict';

const Path        = require('path');
const _           = require('lodash');
const Theme       = require('@frctl/fractal').WebTheme;
const packageJSON = require('../package.json');

module.exports = function(options){

    const config = _.defaultsDeep(_.clone(options || {}), {
        brandColor: '#19ba9a',
        skin: 'default',
        rtl: false,
        lang: 'en',
        styles: 'default',
        scripts: 'default',
        format: 'json',
        static: {
            mount: '_theme',
        },
        version: packageJSON.version,
        favicon: null,
        labels: {
            navigation: {
                information: {
                    title: 'Information',
                    timePrefix: 'Built on:',
                },
                settings: {
                    title: 'Settings',
                    simpleUiLabel: 'Simple UI',
                    testIconsLabel: 'Test icons',
                },
                search: {
                    label: 'Search',
                    placeholder: 'Search…',
                    clear: 'Clear search',
                },
                tree: {
                    collapse: 'Collapse tree',
                },
            },
        },
    });
    const now = new Date();

    config.panels  = config.panels || ['preview', 'html', 'view', 'context', 'resources', 'info'];
    config.nav     = config.nav || ['search', 'components', 'docs', 'assets', 'settings', 'information'];
    config.styles  = [`/${config.static.mount}/css/theme.css`];
    config.scripts = [].concat(config.scripts).filter(url => url).map(url => (url === 'default' ? `/${config.static.mount}/js/mandelbrot.js` : url));
    config.favicon = config.favicon || `/${config.static.mount}/favicon.ico`;
    config.now = config.lang === 'et' ? getEstonianTime(now) : now.toLocaleString(config.lang);
    config.nowIso = now.toISOString();

    const theme = new Theme(Path.join(__dirname, '..', 'views'), config);

    theme.setErrorView('pages/error.nunj');

    theme.addStatic(Path.join(__dirname, '..' , 'dist'), `/${config.static.mount}`);

    theme.addRoute('/', {
        handle: 'overview',
        view: 'pages/doc.nunj',
    });

    theme.addRoute('/docs', {
        redirect: '/'
    });

    theme.addRoute('/components', {
        redirect: '/'
    });

    theme.addRoute('/assets', {
        redirect: '/'
    });

    theme.addRoute('/assets/:name', {
        handle: 'asset-source',
        view: 'pages/assets.nunj'
    }, function(app){
        return app.assets.visible().map(asset => ({name: asset.name}));
    });

    theme.addRoute('/components/preview/:handle', {
        handle: 'preview',
        view: 'pages/components/preview.nunj'
    }, getPreviewHandles);

    theme.addRoute('/components/detail/:handle', {
        handle: 'component',
        view: 'pages/components/detail.nunj'
    }, getDetailHandles);

    theme.addRoute('/components/raw/:handle/:asset', {
        handle: 'component-resource',
        static: function(params, app){
            const component = app.components.find(`@${params.handle}`);
            if (component) {
                return Path.join(component.viewDir, params.asset);
            }
            throw new Error('Component not found');
        }
    }, getResources);

    theme.addRoute('/docs/:path([^?]+?)', {
        handle: 'page',
        view: 'pages/doc.nunj'
    }, function(app){
        return app.docs.filter(d => (!d.isHidden && d.path !== '')).flatten().map(page => ({path: page.path}));
    });

    theme.on('init', function(env, app){
        require('./filters')(theme, env, app);
    });

    let previewHandles = null;

    function getPreviewHandles(app) {
        app.components.on('updated', () => (previewHandles = null));
        if (previewHandles) {
            return previewHandles;
        }
        previewHandles = [];
        app.components.flatten().each(comp => {
            if (!comp.collated || comp.variants().size === 1) {
                previewHandles.push(comp.handle);
            }

            if (comp.variants().size > 1) {
                comp.variants().each(variant => previewHandles.push(variant.handle));
            }
        });
        previewHandles = previewHandles.map(h => ({handle: h}));
        return previewHandles;
    }

    let detailHandles = null;

    function getDetailHandles(app) {
        app.components.on('updated', () => (detailHandles = null));
        if (detailHandles) {
            return detailHandles;
        }
        detailHandles = [];
        app.components.flatten().each(comp => {
            detailHandles.push(comp.handle);

            if (!comp.collated && comp.variants().size > 1) {
                comp.variants().each(variant => detailHandles.push(variant.handle));
            }
        });
        detailHandles = detailHandles.map(h => ({handle: h}));
        return detailHandles;
    }

    function getResources(app) {
        let params = [];
        app.components.flatten().each(comp => {
            params = params.concat(comp.resources().flatten().toArray().map(res => {
                return {
                    handle: comp.handle,
                    asset: res.base
                }
            }));
        });
        return params;
    }

    function getEstonianTime(date) {
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        const time = date.toLocaleTimeString(config.lang, {
            hour: '2-digit',
            minute: '2-digit'
        });

        return day + '.' + month + '.' + year + ' ' + time;
    }

    return theme;
};
