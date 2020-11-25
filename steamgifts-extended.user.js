// ==UserScript==
// @name        steamgifts-extended
// @version     1.0.0
// @author      Vitalij Ryndin
// @description 🎮 Userscript for SteamGifts.com
// @homepage    https://crashmax-off.github.io/SteamGiftsExtended
// @match       *://www.steamgifts.com/*
// @icon        https://crashmax-off.github.io/SteamGiftsExtended/icons/steamgifts.svg
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.css = void 0;
const trim_1 = __webpack_require__(1);
/**
 * Используется для создание стилей
 * @param elem
 * @param css
 */
const css = (elem, css) => {
    let list = css.split(';');
    for (let i in list) {
        if (trim_1.trim(list[i]) !== '') {
            let valList = trim_1.trim(list[i]).split(':');
            if (valList[0].indexOf('-') !== -1) {
                valList[0] = valList[0].replace(/\-([a-z]{1})/g, (e) => {
                    return e.replace('-', '').toUpperCase();
                });
            }
            if (valList[1] !== undefined) {
                elem.style[trim_1.trim(valList[0])] = trim_1.trim(valList[1]);
            }
        }
    }
};
exports.css = css;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = void 0;
/**
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
 * @param str
 */
const trim = (str) => str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
exports.trim = trim;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SteamGifts_1 = __webpack_require__(3);
(() => {
    const app = new SteamGifts_1.SteamGifts;
    app.steamDB();
    app.stickyHeader();
    app.setGiveawayButtons();
})();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamGifts = void 0;
const utils_1 = __webpack_require__(4);
const constants_1 = __webpack_require__(12);
class SteamGifts {
    xsrfToken() {
        var _a;
        const logout = document.getElementsByClassName('js__logout')[0];
        return (_a = logout.getAttribute('data-form')) === null || _a === void 0 ? void 0 : _a.match(/xsrf_token=(.+)/)[1];
    }
    stickyHeader() {
        const header = utils_1.qs('header');
        utils_1.css(header, `
            height: auto;
            position: sticky;
            top: 0;
            z-index: 1
        `);
    }
    getBalance(balance) {
        const points = utils_1.qsa('span.nav__points')[0];
        if (balance)
            points.innerHTML = balance;
        return points.textContent;
    }
    getGiveawayPoints() {
        const titles = utils_1.qsa('span.giveaway__heading__thin');
        const prices = [];
        if (titles) {
            for (let title of titles) {
                if (title.textContent) {
                    let checkPrice = /\(([0-9]+)([P)])\)/i.test(title.textContent);
                    if (checkPrice)
                        prices.push(title.textContent.replace(/\D+/g, ''));
                }
            }
        }
        return prices;
    }
    getGiweawayUrls() {
        const giveaway = utils_1.qsa('div.giveaway__row-inner-wrap');
        const links = utils_1.qsa('a.giveaway__heading__name');
        const urls = [];
        const prices = this.getGiveawayPoints();
        if (links) {
            for (let [key, link] of links.entries()) {
                urls.push([
                    link.href.replace(/\/\s*$/, '').split('/')[4],
                    giveaway[key].classList.contains('is-faded') ?
                        'entry_delete' :
                        'entry_insert',
                    prices[key]
                ]);
            }
        }
        return urls;
    }
    getGiveawayStatus(css) {
        const giveaway = utils_1.qsa('div.giveaway__row-inner-wrap');
        const status = [];
        if (css) {
            for (let give of giveaway) {
                status.push(give.classList.contains('is-faded') ?
                    'entry_delete' :
                    'entry_insert');
            }
        }
        else {
            for (let give of giveaway) {
                status.push(give.className);
            }
        }
        return status;
    }
    getAppID() {
        const urls = utils_1.qsa('a[href^="https://store.steampowered.com/app/"]');
        const apps = [];
        for (let url of urls) {
            apps.push(utils_1.path(4, url.href));
        }
        return apps;
    }
    steamDB() {
        const apps = this.getAppID();
        const targetUrls = utils_1.qsa('a[href^="https://store.steampowered.com/app/"');
        if (utils_1.path(1) === 'giveaway') {
            let btnInGiveaway = utils_1.ce('a', {
                href: `https://steamdb.info/app/${apps[1]}/`,
                attr: {
                    target: '_blank',
                    title: 'Visit SteamDB Info'
                },
                html: `
                    <i>
                        <img style="vertical-align: middle" src="${constants_1.ENV_PATH}/icons/steamdb-white.svg">
                    </i>
                `
            });
            targetUrls[1].before(btnInGiveaway);
        }
        else if (targetUrls) {
            for (let [key, app] of apps.entries()) {
                let btnApp = utils_1.ce('a', {
                    href: `https://steamdb.info/app/${app}/`,
                    attr: {
                        class: 'giveaway__icon',
                        target: '_blank',
                        title: 'Visit SteamDB Info'
                    },
                    html: `<img style="vertical-align: middle" src="${constants_1.ENV_PATH}/icons/steamdb-dark.svg">`
                });
                targetUrls[key].before(btnApp);
            }
        }
        if (utils_1.path(1) === 'user') {
            const target = utils_1.qsa('div.sidebar__shortcut-inner-wrap');
            const profile = utils_1.qsa('a[href^="https://steamcommunity.com/profiles/"');
            const userID = profile[0].href.replace(/\/\s*$/, '').split('/')[4];
            if (userID) {
                let button = utils_1.ce('a', {
                    href: `https://steamdb.info/calculator/${userID}/`,
                    attr: {
                        'data-tooltip': 'Visit SteamDB Calculator',
                        target: '_blank'
                    },
                    html: `<img style="vertical-align: middle" src="${constants_1.ENV_PATH}/icons/steamdb-dark.svg">`
                });
                target[0].append(button);
            }
        }
    }
    setGiveawayButtons() {
        const xsrf = this.xsrfToken();
        const giveaways = this.getGiweawayUrls();
        const target = utils_1.qsa('div.giveaway__links');
        if (utils_1.path(1) !== 'user') {
            for (let i in giveaways) {
                if (giveaways.hasOwnProperty(i)) {
                    let button = utils_1.ce('div', {
                        id: i,
                        style: 'cursor: pointer; user-select: none',
                        html: (giveaways[i][1] === 'entry_delete' ?
                            `
                                <i class="fa fa-minus-circle"></i>
                                <span>Remove Entry</span>
                            ` : `
                                <i class="fa fa-plus-circle"></i>
                                <span>Entry Giveaway</span>
                            `),
                        onclick: (e) => {
                            var _a, _b, _c, _d, _e;
                            if (e.target instanceof Element) {
                                let code = e.target.id;
                                if (typeof code !== 'number')
                                    code = Number(e.target.parentNode.id);
                                let row = (_b = (_a = e.target.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
                                if (!row.classList.contains('giveaway__row-outer-wrap'))
                                    row = (_e = (_d = (_c = e.target.parentNode) === null || _c === void 0 ? void 0 : _c.parentNode) === null || _d === void 0 ? void 0 : _d.parentNode) === null || _e === void 0 ? void 0 : _e.parentNode;
                                utils_1.gebi(code).innerHTML = `
                                    <i class="fa fa-refresh fa-spin"></i>
                                    <span>Please wait...</span>
                                `;
                                utils_1.http('POST', `${constants_1.STEAMGIFTS}/ajax.php`, `xsrf_token=${xsrf}&do=${giveaways[code][1]}&code=${giveaways[code][0]}`).then(e => {
                                    const response = e.parsedBody;
                                    if ((response === null || response === void 0 ? void 0 : response.type) === 'error') {
                                        utils_1.gebi(code).innerHTML = `
                                            <i class="fa fa-exclamation-circle" style="text-shadow: 1px 1px 1px rgba(255,255,255,0.3); color:#a95570"></i>
                                            <span style="color:#a95570">${response.msg}</span>
                                        `;
                                        return false;
                                    }
                                    if ((response === null || response === void 0 ? void 0 : response.type) === 'success') {
                                        this.getBalance(response.points);
                                        if (giveaways[code][1] === 'entry_insert') {
                                            giveaways[code].splice(1, 1, 'entry_delete');
                                            utils_1.gebi(code).innerHTML = `
                                                <i class="fa fa-minus-circle"></i>
                                                <span>Remove Entry</span>
                                            `;
                                            row.classList.add('is-faded');
                                        }
                                        else {
                                            giveaways[code].splice(1, 1, 'entry_insert');
                                            utils_1.gebi(code).innerHTML = `
                                                <i class="fa fa-plus-circle"></i>
                                                <span>Entry Giveaway</span>
                                            `;
                                            row.classList.remove('is-faded');
                                        }
                                    }
                                });
                            }
                        }
                    });
                    target[i].append(button);
                }
            }
        }
    }
}
exports.SteamGifts = SteamGifts;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.path = exports.http = exports.gebi = exports.css = exports.qsa = exports.qs = exports.ce = void 0;
const ce_1 = __webpack_require__(5);
Object.defineProperty(exports, "ce", { enumerable: true, get: function () { return ce_1.ce; } });
const css_1 = __webpack_require__(0);
Object.defineProperty(exports, "css", { enumerable: true, get: function () { return css_1.css; } });
const gebi_1 = __webpack_require__(6);
Object.defineProperty(exports, "gebi", { enumerable: true, get: function () { return gebi_1.gebi; } });
const http_1 = __webpack_require__(7);
Object.defineProperty(exports, "http", { enumerable: true, get: function () { return http_1.http; } });
const path_1 = __webpack_require__(10);
Object.defineProperty(exports, "path", { enumerable: true, get: function () { return path_1.path; } });
const trim_1 = __webpack_require__(1);
Object.defineProperty(exports, "trim", { enumerable: true, get: function () { return trim_1.trim; } });
const qs_1 = __webpack_require__(11);
Object.defineProperty(exports, "qs", { enumerable: true, get: function () { return qs_1.qs; } });
Object.defineProperty(exports, "qsa", { enumerable: true, get: function () { return qs_1.qsa; } });


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ce = void 0;
const css_1 = __webpack_require__(0);
/**
 * Основополагающая функция для создания DOM
 * ? Пример работы:
 * * let div = ce('div', {
 * *     html: 'Hello, World!',
 * *     class: 'example classes',
 * *     style: 'background-color: red; padding: 10px; text-align: center',
 * *     id: 'input',
 * *     attr: { example: 'attribute' }
 * * })
 * *
 * * Вставляем в начале body
 * * document.body.prepend(div)
 * @param name
 * @param params
 */
const ce = (name, params) => {
    let elem = document.createElement(name);
    for (let i in params) {
        switch (i) {
            case 'html':
                elem.innerHTML = params[i];
                break;
            case 'style':
                css_1.css(elem, params[i]);
                break;
            case 'class':
                elem.className = params[i];
                break;
            case 'attr':
                for (let j in params[i]) {
                    elem.setAttribute(j, params[i][j]);
                }
                break;
            default:
                elem[i] = params[i];
        }
    }
    return elem;
};
exports.ce = ce;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.gebi = void 0;
const gebi = (e) => document.getElementById(e);
exports.gebi = gebi;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const console_1 = __webpack_require__(8);
/**
 * Основополагающая функция для формирования HTTP запросов
 * Для использования получаемого JSON используйте Generic interface
 * ? Пример использования смотрите в components/checkUpdates.ts
 * @param method GET/POST
 * @param url Ссылка запроса
 * @param body Строка запроса
 */
async function http(method, url, body) {
    // Запрос поддерживает Generic interface
    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });
    try {
        response.parsedBody = await response.json();
    }
    catch (e) {
        console_1.error('http.ts', e);
    }
    return response;
}
exports.http = http;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = exports.log = void 0;
const ts_debug_1 = __webpack_require__(9);
const logger = new ts_debug_1.Debugger(console, true, '[SGE]: ');
const styles = [
    'background: steelblue',
    'background: green',
    'background: darkorange',
    'background: darkred'
];
const log = (str, obj) => logger.log('%c' + str, styles[0], obj);
exports.log = log;
const info = (str, obj) => logger.info('%c' + str, styles[1], obj);
exports.info = info;
const warn = (str, obj) => logger.warn('%c' + str, styles[2], obj);
exports.warn = warn;
const error = (str, obj) => logger.error('%c' + str, styles[3], obj);
exports.error = error;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Debugger", function() { return Debugger; });
var Debugger = /** @class */ (function () {
    function Debugger(console, isEnabled, prefix) {
        if (isEnabled === void 0) { isEnabled = true; }
        if (prefix === void 0) { prefix = ''; }
        this.prefix = '';
        this.console = console;
        this.isEnabled = isEnabled;
        this.prefix = prefix;
    }
    Object.defineProperty(Debugger.prototype, "memory", {
        get: function () {
            return this.doIfEnabled(function () { return console.hasOwnProperty('memory') && console.memory; });
        },
        enumerable: true,
        configurable: true
    });
    Debugger.prototype.assert = function (value, message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).assert.apply(_a, [value, message].concat(optionalParams));
        });
    };
    Debugger.prototype.countReset = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.countReset(label); });
    };
    Debugger.prototype.dir = function (obj) {
        var _this = this;
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).dir.apply(_a, [obj].concat(options));
        });
    };
    Debugger.prototype.error = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).error.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.info = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).info.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.log = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).log.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.time = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.time(label); });
    };
    Debugger.prototype.timeEnd = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.timeEnd(label); });
    };
    Debugger.prototype.timeLog = function (label) {
        var _this = this;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () { return _this.console.timeLog(label, data); });
    };
    Debugger.prototype.timeStamp = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.timeStamp(label); });
    };
    Debugger.prototype.timeline = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.timeline(label); });
    };
    Debugger.prototype.timelineEnd = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.timelineEnd(label); });
    };
    Debugger.prototype.trace = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).trace.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.warn = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).warn.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.clear = function () {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.clear(); });
    };
    Debugger.prototype.count = function (countTitle) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.count(); });
    };
    Debugger.prototype.debug = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).debug.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.dirxml = function (value) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.dirxml(value); });
    };
    Debugger.prototype.exception = function (message) {
        var _this = this;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).exception.apply(_a, [_this.addPrefix(message)].concat(optionalParams));
        });
    };
    Debugger.prototype.group = function (groupTitle) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.group(groupTitle); });
    };
    Debugger.prototype.groupCollapsed = function (groupTitle) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.groupCollapsed(groupTitle); });
    };
    Debugger.prototype.groupEnd = function () {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.groupEnd(); });
    };
    Debugger.prototype.markTimeline = function (label) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.markTimeline(label); });
    };
    Debugger.prototype.profile = function (reportName) {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.profile(reportName); });
    };
    Debugger.prototype.profileEnd = function () {
        var _this = this;
        return this.doIfEnabled(function () { return _this.console.profileEnd(); });
    };
    Debugger.prototype.table = function () {
        var _this = this;
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        return this.doIfEnabled(function () {
            var _a;
            return (_a = _this.console).table.apply(_a, data);
        });
    };
    /**
     * Throws usual error in debug mode and non-blocking otherwise
     * @param {Error} error
     */
    Debugger.prototype.throw = function (error) {
        error.message = this.addPrefix(error.message);
        if (this.isEnabled) {
            throw error;
        }
        setTimeout(function () {
            throw error;
        });
    };
    Debugger.prototype.doIfEnabled = function (action) {
        if (this.isEnabled) {
            return action();
        }
    };
    Debugger.prototype.addPrefix = function (message) {
        if (this.prefix && (typeof message === 'string' || !message)) {
            return this.prefix + message;
        }
        return message;
    };
    return Debugger;
}());



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.path = void 0;
/**
 * * Используется для получения pathname
 * @param number
 */
const path = (index, url) => {
    let path = url !== null && url !== void 0 ? url : document.location.pathname;
    let str = path.replace(/\/\s*$/, '').split('/');
    return index ? str[index] : path;
};
exports.path = path;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.qsa = exports.qs = void 0;
/**
 * querySelector _/ ( •_•) /
 * @param e
 */
const qs = (e) => document.querySelector(e);
exports.qs = qs;
/**
 * querySelectorAll ᕦ(ツ)ᕤ
 * @param e
 */
const qsa = (e) => document.querySelectorAll(e);
exports.qsa = qsa;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PKG_VERSION = exports.STEAMGIFTS = exports.ENV_PATH = exports.HOSTNAME = exports.GITHUB = exports.HTTP = exports.DEV = void 0;
const package_json_1 = __importDefault(__webpack_require__(13));
const DEV =  false ? undefined : false;
exports.DEV = DEV;
const HTTP = document.location.protocol;
exports.HTTP = HTTP;
const GITHUB = package_json_1.default.homepage;
exports.GITHUB = GITHUB;
const HOSTNAME = document.location.hostname;
exports.HOSTNAME = HOSTNAME;
const ENV_PATH = DEV ? 'https://localhost:8080' : GITHUB;
exports.ENV_PATH = ENV_PATH;
const STEAMGIFTS = `${HTTP}//${HOSTNAME}`;
exports.STEAMGIFTS = STEAMGIFTS;
const PKG_VERSION = package_json_1.default.version;
exports.PKG_VERSION = PKG_VERSION;


/***/ }),
/* 13 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"steamgifts-extended\",\"description\":\"🎮 Userscript for SteamGifts.com\",\"homepage\":\"https://crashmax-off.github.io/SteamGiftsExtended\",\"version\":\"1.0.0\",\"author\":{\"name\":\"Vitalij Ryndin\",\"email\":\"sys@crashmax.ru\",\"url\":\"https://crashmax.ru\"},\"scripts\":{\"dev\":\"cross-env NODE_ENV=development webpack-dev-server --config-name main --host localhost --watch-poll\",\"build\":\"cross-env NODE_ENV=production webpack --progress\"},\"devDependencies\":{\"@types/node\":\"^14.11.8\",\"@types/webpack\":\"^4.41.22\",\"@types/webpack-dev-server\":\"^3.11.0\",\"clean-webpack-plugin\":\"^3.0.0\",\"copy-webpack-plugin\":\"^6.3.2\",\"cross-env\":\"^7.0.2\",\"optimize-css-assets-webpack-plugin\":\"^5.0.4\",\"ts-debug\":\"^1.3.0\",\"ts-loader\":\"^8.0.4\",\"ts-node\":\"^9.0.0\",\"typescript\":\"^4.0.2\",\"webpack\":\"^4.44.2\",\"webpack-cli\":\"^3.3.12\",\"webpack-dev-server\":\"^3.11.0\",\"webpack-userscript\":\"^2.5.6\"}}");

/***/ })
/******/ ]);