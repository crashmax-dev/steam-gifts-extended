// ==UserScript==
// @name           SteamGiftsExtented
// @namespace      https://github.com/crashmax-off/SteamGiftsExtented
// @description    Extended Functionality SteamGifts.com
// @author         Vitalij Ryndin
// @icon           https://github.com/crashmax-off/SteamGiftsExtented/raw/master/assets/icons/logo.png
// @include        https://www.steamgifts.com/*
// @match          https://www.steamgifts.com/*
// @version        1.0.0
// ==/UserScript==

(function () {
    function SteamGifts() {
        var config = {
            'github': 'https://cdn.rawgit.com/crashmax-off/SteamGiftsExtented/master/'
        }
        var main = {
            ajax: function (data, callback, rstate) {
                rstate = (typeof rstate != "undefined" ? rstate : 4);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/ajax.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(data);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == rstate) {
                        if (xhr.status == 200) {
                            if (callback) {
                                callback(xhr.responseText);
                            }
                        } else {
                            return false;
                        }
                    }
                };
            },
            ce: function (name, param) {
                var newEl = document.createElement(name);
                if (param) {
                    for (var i in param) {
                        if (i == "style") {
                            main.css(newEl, param[i]);
                        } else if (i == "attr") {
                            for (var j in param[i]) {
                                newEl.setAttribute(j, param[i][j]);
                            }
                        } else if (i == "html") {
                            newEl.innerHTML = param[i];
                        } else if (i == "class") {
                            newEl.className = param[i];
                        } else {
                            newEl[i] = param[i];
                        }
                    }
                }
                return newEl;
            },
            gebi: function (e) {
                return document.getElementById(e);
            },
            css: function (elem, css) {
                var tList = css.split(";");
                for (var i in tList) {
                    if (main.trim(tList[i]) != "") {
                        var valList = main.trim(tList[i]).split(":");
                        if (valList[0].indexOf("-") >= 0) {
                            valList[0] = valList[0].replace(/\-([a-z]{1})/g, function (a, b) {
                                return b.toUpperCase();
                            });
                        }
                        if (typeof valList[1] != "undefined") {
                            elem.style[main.trim(valList[0])] = main.trim(valList[1]);
                        }
                    }
                }
            },
            trim: function (str) {
                var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
                return str.replace(rtrim, '');
            },
            find: function (obj, obj2) {
                var list = new Array();
                for (var i = 0; i < obj.length; i++) {
                    for (var j in obj2) {
                        if (obj[i][j].indexOf(obj2[j]) >= 0) {
                            list.push(obj[i]);
                        }
                    }
                }
                return list[0] ? list : null;
            },
            xsrf: function () {
                var xsrf = main.find(document.getElementsByTagName("input"), {
                    name: "xsrf_token"
                });
                return xsrf ? xsrf[0].defaultValue : console.warn("[SG+] XSRF Not Found!");
            },
            path: function (e) {
                var path = document.location.pathname.toString();
                return e ? path.replace(/\/\s*$/, '').split('/')[e] : path.replace(/\/\s*$/, '').split('/');
            },
            stickyHeader: function () {
                var style = main.ce("style", {
                    type: "text/css",
                    html: "header{height:auto;position:sticky;top:0;z-index:1}"
                });
                document.getElementsByTagName('head')[0].appendChild(style);
            },
            getBalance: function (value) {
                var points = main.find(document.getElementsByTagName("span"), {
                    className: "nav__points"
                });
                if (value) {
                    points[0].innerHTML = value;
                }
                return points[0].textContent;
            },
            getGiweawayUrls: function () {
                var giveaway = main.find(document.getElementsByTagName("div"), {
                    className: "giveaway__row-inner-wrap"
                });
                var links = main.find(document.links, {
                    className: "giveaway__heading__name"
                });
                var Urls = new Array();
                var Prices = main.getGiveawayPoints();
                if (links) {
                    for (var i = 0; i < links.length; i++) {
                        Urls.push([links[i].href.replace(/\/\s*$/, '').split('/')[4], giveaway[i].className == "giveaway__row-inner-wrap is-faded" ? "entry_delete" : "entry_insert", Prices[i]]);
                    }
                }
                return Urls;
            },
            getGiveawayStatus: function (css) {
                var giveaway = main.find(document.getElementsByTagName("div"), {
                    className: "giveaway__row-inner-wrap"
                });
                var Status = new Array();
                if (!css) {
                    for (var i = 0; i < giveaway.length; i++) {
                        Status.push(giveaway[i].className == "giveaway__row-inner-wrap is-faded" ? "entry_delete" : "entry_insert");
                    }
                } else {
                    for (var i = 0; i < giveaway.length; i++) {
                        Status.push(giveaway[i].className);
                    }
                }
                return Status;
            },
            getGiveawayPoints: function () {
                var titles = main.find(document.getElementsByTagName("span"), {
                    className: "giveaway__heading__thin"
                });
                var Prices = new Array();
                if (titles) {
                    for (var i = 0; i < titles.length; i++) {
                        var checkPrice = /\(([0-9]+)([P)])\)/i.test(titles[i].textContent);
                        if (checkPrice) {
                            Prices.push(titles[i].textContent.replace(/\D+/g, ""));
                        }
                    }
                }
                return Prices;
            },
            setGiveawayButtons: function () {
                var xsrf = main.xsrf();
                var Giveaway = main.getGiweawayUrls();
                var target = main.find(document.getElementsByTagName("div"), {
                    className: "giveaway__links"
                });
                for (i in Giveaway) {
                    if (Giveaway.hasOwnProperty(i)) {
                        var button = main.ce("div", {
                            style: "cursor: pointer",
                            id: i,
                            html: (Giveaway[i][1] == "entry_delete" ? '<i class="fa fa-minus-circle"></i> <span>Remove Entry</span>' : '<i class="fa fa-plus-circle"></i> <span>Entry Giveaway</span>'),
                            onclick: function (e) {
                                var code = e.target.id;
                                if (code == '') code = e.target.parentNode.id;
                                var row = e.target.parentNode.parentNode.parentNode;
                                if (row.classList != 'giveaway__row-outer-wrap') row = e.target.parentNode.parentNode.parentNode.parentNode;
                                var params = `xsrf_token=${xsrf}&do=${Giveaway[code][1]}&code=${Giveaway[code][0]}`;
                                main.gebi(code).innerHTML = '<i class="fa fa-refresh fa-spin"></i> <span>Please wait...</span>';
                                main.ajax(params, function (r) {
                                    r = JSON.parse(r);
                                    if (r.type == "success") {
                                        main.getBalance(r.points)
                                        if (Giveaway[code][1] == "entry_insert") {
                                            Giveaway[code].splice(1, 1, "entry_delete");
                                            main.gebi(code).innerHTML = '<i class="fa fa-minus-circle"></i> <span>Remove Entry</span>';
                                            row.classList.add("is-faded");
                                        } else {
                                            Giveaway[code].splice(1, 1, "entry_insert");
                                            main.gebi(code).innerHTML = '<i class="fa fa-plus-circle"></i> <span>Entry Giveaway</span>';
                                            row.classList.remove("is-faded");
                                        }
                                    } else if (r.type == "error") {
                                        main.gebi(code).innerHTML = `<i class="fa fa-exclamation-circle" style="text-shadow: 1px 1px 1px rgba(255,255,255,0.3);color:#a95570"></i> <span style="color:#a95570">${r.msg}</span>`;
                                    }
                                });
                            }
                        });
                    }
                    target[i].append(button);
                }
            },
            steamDB: function () {
                if (main.path(1) == 'user') {
                    var target = main.find(document.getElementsByTagName("div"), {
                        className: "sidebar__shortcut-inner-wrap"
                    });
                    var profile = main.find(document.links, {
                        href: "https://steamcommunity.com/profiles/"
                    });
                    var getID = profile[0].href.replace(/\/\s*$/, '').split('/')[4];
                    if (getID) {
                        var button = main.ce("a", {
                            href: `https://steamdb.info/calculator/${getID}/`,
                            attr: {
                                "data-tooltip": "Visit SteamDB Calculator",
                                target: "_blank"
                            },
                            html: `<i class="fa"><img src="${config['github'] + 'assets/icons/steamdb.svg'}"><i>`
                        });
                        target[0].append(button);
                    }
                }
            },
            start: function () {
                main.steamDB();
                main.stickyHeader();
                main.setGiveawayButtons();
            }
        };
        main.start();
    }
    SteamGifts();
})()