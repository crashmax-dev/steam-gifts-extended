// ==UserScript==
// @name            SteamGiftsExtented
// @namespace       https://github.com/crashmax-off/SteamGiftsExtented
// @description     Description
// @author          Vitalij Ryndin
// @icon            https://cdn.steamgifts.com/img/favicon.ico
// @include         https://www.steamgifts.com/*
// @match           https://www.steamgifts.com/*
// @version         1.0.0
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
            entryButtons: function () {
                var xsrf = main.xsrf();
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
                            html: '<i class="fa fa-plus-circle"></i> <span>Entry Giveaway</span>',
                            onclick: function (e) {
                                var code = e.target.id;
                                if (code == '') code = e.target.parentNode.id;
                                var params = `xsrf_token=${xsrf}&do=entry_insert&code=${code}`;
                                console.log(params);
                                main.ajax("https://www.steamgifts.com/ajax.php", "POST", params, function (r) {
                                    console.log(r);
                                });
                            }
                        });
                        target[i].append(button);
                    }
                }
            },
            start: function () {
                main.entryButtons();
            }
        };
        main.start();
    }
    SteamGifts();
})()