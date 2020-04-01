// ==UserScript==
// @name           SteamGiftsExtented
// @namespace      https://github.com/crashmax-off/SteamGiftsExtented
// @description    Description
// @author         Vitalij Ryndin
// @icon           https://cdn.steamgifts.com/img/favicon.ico
// @include        https://www.steamgifts.com/*
// @match          https://www.steamgifts.com/*
// @version        1.0.0
// ==/UserScript==

(function () {
    function SteamGifts() {
        var main = {
            ajax: function (url, method, data, callback, rstate) {
                rstate = (typeof rstate != "undefined" ? rstate : 4);
                var xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                if (method == "POST") {
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.send(data);
                } else {
                    xhr.send();
                }
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
                return xsrf[0].defaultValue;
            },
            fixHeader: function () {
                var style = main.ce("style", {
                    type: "text/css",
                    html: "header{position:fixed;width:-webkit-fill-available;z-index:1;margin-top:-29px}body{margin-top:29px}"
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
            entryButtons: function () {
                var xsrf = main.xsrf();
                var Status = main.giveawayStatus();
                var Prices = main.getPrices();
                var links = main.find(document.links, {
                    className: "giveaway__heading__name"
                });
                var target = main.find(document.getElementsByTagName("div"), {
                    className: "giveaway__links"
                });
                if (links) {
                    var linksArray = new Array();
                    for (var i = 0; i < links.length; i++) {
                        linksArray.push(links[i].href.replace(/\/\s*$/, '').split('/')[4]);
                    }
                }
                if (target) {
                    for (var i = 0; i < target.length; i++) {
                        var button = main.ce("div", {
                            style: "cursor: pointer",
                            id: linksArray[i],
                            class: Status[i],
                            html: (Status[i] == "entry_delete" ? '<i class="fa fa-minus-circle"></i> <span>Remove Entry</span>' : '<i class="fa fa-plus-circle"></i> <span>Entry Giveaway</span>'),
                            onclick: function (e) {

                                console.log(e.target.className)

                                var code = e.target.id;
                                if (code == '') code = e.target.parentNode.id;

                                var attributes = e.target.className;
                                if (attributes == 'entry_delete' && 'entry_insert') {
                                    attributes = e.target.className;
                                } else if(attributes == 'giveaway__links') {
                                    attributes = e.target.parentNode.className;
                                }
                                
                                var params = `xsrf_token=${xsrf}&do=${attributes}&code=${code}`;
                                console.log(params);
                                main.ajax("https://www.steamgifts.com/ajax.php", "POST", params, function (r) {
                                    r = JSON.parse(r);
                                    console.log(r);
                                    if (r.type == "success") {
                                        //if(r.points >= main.navPoints())
                                        main.getBalance(r.points)
                                    } else if (r.type == "error") {
                                        console.log(r.msg);
                                    }
                                });
                            }
                        });
                        target[i].append(button);
                    }
                }
            },
            giveawayStatus: function () {
                var giveaway = main.find(document.getElementsByTagName("div"), {
                    className: "giveaway__row-inner-wrap"
                });
                var Status = new Array();
                if (giveaway) {
                    for (var i = 0; i < giveaway.length; i++) {
                        Status.push(giveaway[i].className == "giveaway__row-inner-wrap is-faded" ? "entry_delete" : "entry_insert");
                    }
                }
                return Status;
            },
            getPrices: function () {
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
            start: function () {
                main.fixHeader();
                main.entryButtons();
            }
        };
        main.start();
    }
    SteamGifts();
})()