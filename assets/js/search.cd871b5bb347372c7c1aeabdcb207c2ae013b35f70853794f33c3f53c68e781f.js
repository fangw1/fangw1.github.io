/**
 * Fuse.js v6.5.3 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2021 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var e, t;
e = this, t = function () {
    "use strict";

    function e(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t && (r = r.filter((function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable
            }))), n.push.apply(n, r)
        }
        return n
    }

    function t(t) {
        for (var n = 1; n < arguments.length; n++) {
            var r = null != arguments[n] ? arguments[n] : {};
            n % 2 ? e(Object(r), !0).forEach((function (e) {
                a(t, e, r[e])
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : e(Object(r)).forEach((function (e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e))
            }))
        }
        return t
    }

    function n(e) {
        return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }, n(e)
    }

    function r(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
        }
    }

    function o(e, t, n) {
        return t && i(e.prototype, t), n && i(e, n), Object.defineProperty(e, "prototype", {writable: !1}), e
    }

    function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function c(e) {
        return function (e) {
            if (Array.isArray(e)) return s(e)
        }(e) || function (e) {
            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
        }(e) || function (e, t) {
            if (e) {
                if ("string" == typeof e) return s(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? s(e, t) : void 0
            }
        }(e) || function () {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function s(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
    }

    function h(e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === g(e)
    }

    function u(e) {
        return "string" == typeof e
    }

    function l(e) {
        return "number" == typeof e
    }

    function d(e) {
        return !0 === e || !1 === e || function (e) {
            return function (e) {
                return "object" === n(e)
            }(e) && null !== e
        }(e) && "[object Boolean]" == g(e)
    }

    function f(e) {
        return null != e
    }

    function v(e) {
        return !e.trim().length
    }

    function g(e) {
        return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e)
    }

    var y = "Extended search is not available", p = function (e) {
        return "Pattern length exceeds max of ".concat(e, ".")
    }, m = Object.prototype.hasOwnProperty, b = function () {
        function e(t) {
            var n = this;
            r(this, e), this._keys = [], this._keyMap = {};
            var i = 0;
            t.forEach((function (e) {
                var t = k(e);
                i += t.weight, n._keys.push(t), n._keyMap[t.id] = t, i += t.weight
            })), this._keys.forEach((function (e) {
                e.weight /= i
            }))
        }

        return o(e, [{
            key: "get", value: function (e) {
                return this._keyMap[e]
            }
        }, {
            key: "keys", value: function () {
                return this._keys
            }
        }, {
            key: "toJSON", value: function () {
                return JSON.stringify(this._keys)
            }
        }]), e
    }();

    function k(e) {
        var t = null, n = null, r = null, i = 1;
        if (u(e) || h(e)) r = e, t = M(e), n = w(e); else {
            if (!m.call(e, "name")) throw new Error(function (e) {
                return "Missing ".concat(e, " property in key")
            }("name"));
            var o = e.name;
            if (r = o, m.call(e, "weight") && (i = e.weight) <= 0) throw new Error(function (e) {
                return "Property 'weight' in key '".concat(e, "' must be a positive integer")
            }(o));
            t = M(o), n = w(o)
        }
        return {path: t, id: n, weight: i, src: r}
    }

    function M(e) {
        return h(e) ? e : e.split(".")
    }

    function w(e) {
        return h(e) ? e.join(".") : e
    }

    var x = {
        useExtendedSearch: !1, getFn: function (e, t) {
            var n = [], r = !1;
            return function e(t, i, o) {
                if (f(t)) if (i[o]) {
                    var a = t[i[o]];
                    if (!f(a)) return;
                    if (o === i.length - 1 && (u(a) || l(a) || d(a))) n.push(function (e) {
                        return null == e ? "" : function (e) {
                            if ("string" == typeof e) return e;
                            var t = e + "";
                            return "0" == t && 1 / e == -1 / 0 ? "-0" : t
                        }(e)
                    }(a)); else if (h(a)) {
                        r = !0;
                        for (var c = 0, s = a.length; c < s; c += 1) e(a[c], i, o + 1)
                    } else i.length && e(a, i, o + 1)
                } else n.push(t)
            }(e, u(t) ? t.split(".") : t, 0), r ? n : n[0]
        }, ignoreLocation: !1, ignoreFieldNorm: !1, fieldNormWeight: 1
    }, L = t(t(t(t({}, {
        isCaseSensitive: !1, includeScore: !1, keys: [], shouldSort: !0, sortFn: function (e, t) {
            return e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1
        }
    }), {includeMatches: !1, findAllMatches: !1, minMatchCharLength: 1}), {
        location: 0,
        threshold: .6,
        distance: 100
    }), x), _ = /[^ ]+/g;

    function S() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3, n = new Map, r = Math.pow(10, t);
        return {
            get: function (t) {
                var i = t.match(_).length;
                if (n.has(i)) return n.get(i);
                var o = 1 / Math.pow(i, .5 * e), a = parseFloat(Math.round(o * r) / r);
                return n.set(i, a), a
            }, clear: function () {
                n.clear()
            }
        }
    }

    var O = function () {
        function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = t.getFn,
                i = void 0 === n ? L.getFn : n, o = t.fieldNormWeight, a = void 0 === o ? L.fieldNormWeight : o;
            r(this, e), this.norm = S(a, 3), this.getFn = i, this.isCreated = !1, this.setIndexRecords()
        }

        return o(e, [{
            key: "setSources", value: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                this.docs = e
            }
        }, {
            key: "setIndexRecords", value: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                this.records = e
            }
        }, {
            key: "setKeys", value: function () {
                var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                this.keys = t, this._keysMap = {}, t.forEach((function (t, n) {
                    e._keysMap[t.id] = n
                }))
            }
        }, {
            key: "create", value: function () {
                var e = this;
                !this.isCreated && this.docs.length && (this.isCreated = !0, u(this.docs[0]) ? this.docs.forEach((function (t, n) {
                    e._addString(t, n)
                })) : this.docs.forEach((function (t, n) {
                    e._addObject(t, n)
                })), this.norm.clear())
            }
        }, {
            key: "add", value: function (e) {
                var t = this.size();
                u(e) ? this._addString(e, t) : this._addObject(e, t)
            }
        }, {
            key: "removeAt", value: function (e) {
                this.records.splice(e, 1);
                for (var t = e, n = this.size(); t < n; t += 1) this.records[t].i -= 1
            }
        }, {
            key: "getValueForItemAtKeyId", value: function (e, t) {
                return e[this._keysMap[t]]
            }
        }, {
            key: "size", value: function () {
                return this.records.length
            }
        }, {
            key: "_addString", value: function (e, t) {
                if (f(e) && !v(e)) {
                    var n = {v: e, i: t, n: this.norm.get(e)};
                    this.records.push(n)
                }
            }
        }, {
            key: "_addObject", value: function (e, t) {
                var n = this, r = {i: t, $: {}};
                this.keys.forEach((function (t, i) {
                    var o = n.getFn(e, t.path);
                    if (f(o)) if (h(o)) !function () {
                        for (var e = [], t = [{nestedArrIndex: -1, value: o}]; t.length;) {
                            var a = t.pop(), c = a.nestedArrIndex, s = a.value;
                            if (f(s)) if (u(s) && !v(s)) {
                                var l = {v: s, i: c, n: n.norm.get(s)};
                                e.push(l)
                            } else h(s) && s.forEach((function (e, n) {
                                t.push({nestedArrIndex: n, value: e})
                            }))
                        }
                        r.$[i] = e
                    }(); else if (!v(o)) {
                        var a = {v: o, n: n.norm.get(o)};
                        r.$[i] = a
                    }
                })), this.records.push(r)
            }
        }, {
            key: "toJSON", value: function () {
                return {keys: this.keys, records: this.records}
            }
        }]), e
    }();

    function A(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r = n.getFn,
            i = void 0 === r ? L.getFn : r, o = n.fieldNormWeight, a = void 0 === o ? L.fieldNormWeight : o,
            c = new O({getFn: i, fieldNormWeight: a});
        return c.setKeys(e.map(k)), c.setSources(t), c.create(), c
    }

    function j(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = t.errors,
            r = void 0 === n ? 0 : n, i = t.currentLocation, o = void 0 === i ? 0 : i, a = t.expectedLocation,
            c = void 0 === a ? 0 : a, s = t.distance, h = void 0 === s ? L.distance : s, u = t.ignoreLocation,
            l = void 0 === u ? L.ignoreLocation : u, d = r / e.length;
        if (l) return d;
        var f = Math.abs(c - o);
        return h ? d + f / h : f ? 1 : d
    }

    function E() {
        for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : L.minMatchCharLength, n = [], r = -1, i = -1, o = 0, a = e.length; o < a; o += 1) {
            var c = e[o];
            c && -1 === r ? r = o : c || -1 === r || ((i = o - 1) - r + 1 >= t && n.push([r, i]), r = -1)
        }
        return e[o - 1] && o - r >= t && n.push([r, o - 1]), n
    }

    var I = 32;

    function C(e) {
        for (var t = {}, n = 0, r = e.length; n < r; n += 1) {
            var i = e.charAt(n);
            t[i] = (t[i] || 0) | 1 << r - n - 1
        }
        return t
    }

    var F = function () {
        function e(t) {
            var n = this, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, o = i.location,
                a = void 0 === o ? L.location : o, c = i.threshold, s = void 0 === c ? L.threshold : c, h = i.distance,
                u = void 0 === h ? L.distance : h, l = i.includeMatches, d = void 0 === l ? L.includeMatches : l,
                f = i.findAllMatches, v = void 0 === f ? L.findAllMatches : f, g = i.minMatchCharLength,
                y = void 0 === g ? L.minMatchCharLength : g, p = i.isCaseSensitive,
                m = void 0 === p ? L.isCaseSensitive : p, b = i.ignoreLocation, k = void 0 === b ? L.ignoreLocation : b;
            if (r(this, e), this.options = {
                location: a,
                threshold: s,
                distance: u,
                includeMatches: d,
                findAllMatches: v,
                minMatchCharLength: y,
                isCaseSensitive: m,
                ignoreLocation: k
            }, this.pattern = m ? t : t.toLowerCase(), this.chunks = [], this.pattern.length) {
                var M = function (e, t) {
                    n.chunks.push({pattern: e, alphabet: C(e), startIndex: t})
                }, w = this.pattern.length;
                if (w > I) {
                    for (var x = 0, _ = w % I, S = w - _; x < S;) M(this.pattern.substr(x, I), x), x += I;
                    if (_) {
                        var O = w - I;
                        M(this.pattern.substr(O), O)
                    }
                } else M(this.pattern, 0)
            }
        }

        return o(e, [{
            key: "searchIn", value: function (e) {
                var t = this.options, n = t.isCaseSensitive, r = t.includeMatches;
                if (n || (e = e.toLowerCase()), this.pattern === e) {
                    var i = {isMatch: !0, score: 0};
                    return r && (i.indices = [[0, e.length - 1]]), i
                }
                var o = this.options, a = o.location, s = o.distance, h = o.threshold, u = o.findAllMatches,
                    l = o.minMatchCharLength, d = o.ignoreLocation, f = [], v = 0, g = !1;
                this.chunks.forEach((function (t) {
                    var n = t.pattern, i = t.alphabet, o = t.startIndex, y = function (e, t, n) {
                        var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, i = r.location,
                            o = void 0 === i ? L.location : i, a = r.distance, c = void 0 === a ? L.distance : a,
                            s = r.threshold, h = void 0 === s ? L.threshold : s, u = r.findAllMatches,
                            l = void 0 === u ? L.findAllMatches : u, d = r.minMatchCharLength,
                            f = void 0 === d ? L.minMatchCharLength : d, v = r.includeMatches,
                            g = void 0 === v ? L.includeMatches : v, y = r.ignoreLocation,
                            m = void 0 === y ? L.ignoreLocation : y;
                        if (t.length > I) throw new Error(p(I));
                        for (var b, k = t.length, M = e.length, w = Math.max(0, Math.min(o, M)), x = h, _ = w, S = f > 1 || g, O = S ? Array(M) : []; (b = e.indexOf(t, _)) > -1;) {
                            var A = j(t, {currentLocation: b, expectedLocation: w, distance: c, ignoreLocation: m});
                            if (x = Math.min(A, x), _ = b + k, S) for (var C = 0; C < k;) O[b + C] = 1, C += 1
                        }
                        _ = -1;
                        for (var F = [], N = 1, P = k + M, W = 1 << k - 1, $ = 0; $ < k; $ += 1) {
                            for (var D = 0, K = P; D < K;) j(t, {
                                errors: $,
                                currentLocation: w + K,
                                expectedLocation: w,
                                distance: c,
                                ignoreLocation: m
                            }) <= x ? D = K : P = K, K = Math.floor((P - D) / 2 + D);
                            P = K;
                            var T = Math.max(1, w - K + 1), z = l ? M : Math.min(w + K, M) + k, J = Array(z + 2);
                            J[z + 1] = (1 << $) - 1;
                            for (var R = z; R >= T; R -= 1) {
                                var U = R - 1, B = n[e.charAt(U)];
                                if (S && (O[U] = +!!B), J[R] = (J[R + 1] << 1 | 1) & B, $ && (J[R] |= (F[R + 1] | F[R]) << 1 | 1 | F[R + 1]), J[R] & W && (N = j(t, {
                                    errors: $,
                                    currentLocation: U,
                                    expectedLocation: w,
                                    distance: c,
                                    ignoreLocation: m
                                })) <= x) {
                                    if (x = N, (_ = U) <= w) break;
                                    T = Math.max(1, 2 * w - _)
                                }
                            }
                            if (j(t, {
                                errors: $ + 1,
                                currentLocation: w,
                                expectedLocation: w,
                                distance: c,
                                ignoreLocation: m
                            }) > x) break;
                            F = J
                        }
                        var V = {isMatch: _ >= 0, score: Math.max(.001, N)};
                        if (S) {
                            var q = E(O, f);
                            q.length ? g && (V.indices = q) : V.isMatch = !1
                        }
                        return V
                    }(e, n, i, {
                        location: a + o,
                        distance: s,
                        threshold: h,
                        findAllMatches: u,
                        minMatchCharLength: l,
                        includeMatches: r,
                        ignoreLocation: d
                    }), m = y.isMatch, b = y.score, k = y.indices;
                    m && (g = !0), v += b, m && k && (f = [].concat(c(f), c(k)))
                }));
                var y = {isMatch: g, score: g ? v / this.chunks.length : 1};
                return g && r && (y.indices = f), y
            }
        }]), e
    }(), N = [];

    function P(e, t) {
        for (var n = 0, r = N.length; n < r; n += 1) {
            var i = N[n];
            if (i.condition(e, t)) return new i(e, t)
        }
        return new F(e, t)
    }

    function W(e, t) {
        var n = t.ignoreFieldNorm, r = void 0 === n ? L.ignoreFieldNorm : n;
        e.forEach((function (e) {
            var t = 1;
            e.matches.forEach((function (e) {
                var n = e.key, i = e.norm, o = e.score, a = n ? n.weight : null;
                t *= Math.pow(0 === o && a ? Number.EPSILON : o, (a || 1) * (r ? 1 : i))
            })), e.score = t
        }))
    }

    function $(e, t) {
        var n = e.matches;
        t.matches = [], f(n) && n.forEach((function (e) {
            if (f(e.indices) && e.indices.length) {
                var n = {indices: e.indices, value: e.value};
                e.key && (n.key = e.key.src), e.idx > -1 && (n.refIndex = e.idx), t.matches.push(n)
            }
        }))
    }

    function D(e, t) {
        t.score = e.score
    }

    function K(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r = n.includeMatches,
            i = void 0 === r ? L.includeMatches : r, o = n.includeScore, a = void 0 === o ? L.includeScore : o, c = [];
        return i && c.push($), a && c.push(D), e.map((function (e) {
            var n = e.idx, r = {item: t[n], refIndex: n};
            return c.length && c.forEach((function (t) {
                t(e, r)
            })), r
        }))
    }

    var T = function () {
        function e(n) {
            var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                o = arguments.length > 2 ? arguments[2] : void 0;
            if (r(this, e), this.options = t(t({}, L), i), this.options.useExtendedSearch) throw new Error(y);
            this._keyStore = new b(this.options.keys), this.setCollection(n, o)
        }

        return o(e, [{
            key: "setCollection", value: function (e, t) {
                if (this._docs = e, t && !(t instanceof O)) throw new Error("Incorrect 'index' type");
                this._myIndex = t || A(this.options.keys, this._docs, {
                    getFn: this.options.getFn,
                    fieldNormWeight: this.options.fieldNormWeight
                })
            }
        }, {
            key: "add", value: function (e) {
                f(e) && (this._docs.push(e), this._myIndex.add(e))
            }
        }, {
            key: "remove", value: function () {
                for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function () {
                    return !1
                }, t = [], n = 0, r = this._docs.length; n < r; n += 1) {
                    var i = this._docs[n];
                    e(i, n) && (this.removeAt(n), n -= 1, r -= 1, t.push(i))
                }
                return t
            }
        }, {
            key: "removeAt", value: function (e) {
                this._docs.splice(e, 1), this._myIndex.removeAt(e)
            }
        }, {
            key: "getIndex", value: function () {
                return this._myIndex
            }
        }, {
            key: "search", value: function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = t.limit,
                    r = void 0 === n ? -1 : n, i = this.options, o = i.includeMatches, a = i.includeScore,
                    c = i.shouldSort, s = i.sortFn, h = i.ignoreFieldNorm,
                    d = u(e) ? u(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
                return W(d, {ignoreFieldNorm: h}), c && d.sort(s), l(r) && r > -1 && (d = d.slice(0, r)), K(d, this._docs, {
                    includeMatches: o,
                    includeScore: a
                })
            }
        }, {
            key: "_searchStringList", value: function (e) {
                var t = P(e, this.options), n = this._myIndex.records, r = [];
                return n.forEach((function (e) {
                    var n = e.v, i = e.i, o = e.n;
                    if (f(n)) {
                        var a = t.searchIn(n), c = a.isMatch, s = a.score, h = a.indices;
                        c && r.push({item: n, idx: i, matches: [{score: s, value: n, norm: o, indices: h}]})
                    }
                })), r
            }
        }, {
            key: "_searchLogical", value: function (e) {
                throw new Error("Logical search is not available")
            }
        }, {
            key: "_searchObjectList", value: function (e) {
                var t = this, n = P(e, this.options), r = this._myIndex, i = r.keys, o = r.records, a = [];
                return o.forEach((function (e) {
                    var r = e.$, o = e.i;
                    if (f(r)) {
                        var s = [];
                        i.forEach((function (e, i) {
                            s.push.apply(s, c(t._findMatches({key: e, value: r[i], searcher: n})))
                        })), s.length && a.push({idx: o, item: r, matches: s})
                    }
                })), a
            }
        }, {
            key: "_findMatches", value: function (e) {
                var t = e.key, n = e.value, r = e.searcher;
                if (!f(n)) return [];
                var i = [];
                if (h(n)) n.forEach((function (e) {
                    var n = e.v, o = e.i, a = e.n;
                    if (f(n)) {
                        var c = r.searchIn(n), s = c.isMatch, h = c.score, u = c.indices;
                        s && i.push({score: h, key: t, value: n, idx: o, norm: a, indices: u})
                    }
                })); else {
                    var o = n.v, a = n.n, c = r.searchIn(o), s = c.isMatch, u = c.score, l = c.indices;
                    s && i.push({score: u, key: t, value: o, norm: a, indices: l})
                }
                return i
            }
        }]), e
    }();
    return T.version = "6.5.3", T.createIndex = A, T.parseIndex = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = t.getFn,
            r = void 0 === n ? L.getFn : n, i = t.fieldNormWeight, o = void 0 === i ? L.fieldNormWeight : i, a = e.keys,
            c = e.records, s = new O({getFn: r, fieldNormWeight: o});
        return s.setKeys(a), s.setIndexRecords(c), s
    }, T.config = L, T
}, "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Fuse = t();
;
/*
  PaperMod v6
  License: MIT https://github.com/adityatelange/hugo-PaperMod/blob/master/LICENSE
  Copyright (c) 2020 nanxiaobei and adityatelange
  Copyright (c) 2021-2022 adityatelange
*/

;
(()=>{var i,r,c,e={distance:1e3,iscasesensitive:!1,keys:["title","permalink","summary"],location:0,minmatchcharlength:0,shouldsort:!0,threshold:1},n=document.getElementById("searchResults"),t=document.getElementById("searchInput"),a=null,s=!1;window.onload=function(){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(t.readyState===4)if(t.status===200){var n,s=JSON.parse(t.responseText);s&&(n={distance:100,threshold:.4,ignoreLocation:!0,keys:["title","permalink","summary","content"]},e&&(n={isCaseSensitive:!!e.iscasesensitive&&e.iscasesensitive,includeScore:!!e.includescore&&e.includescore,includeMatches:!!e.includematches&&e.includematches,minMatchCharLength:e.minmatchcharlength?e.minmatchcharlength:1,shouldSort:!e.shouldsort||e.shouldsort,findAllMatches:!!e.findallmatches&&e.findallmatches,keys:e.keys?e.keys:["title","permalink","summary","content"],location:e.location?e.location:0,threshold:e.threshold?e.threshold:.4,distance:e.distance?e.distance:100,ignoreLocation:!e.ignorelocation||e.ignorelocation}),i=new Fuse(s,n))}else console.log(t.responseText)},t.open("GET","../index.json"),t.send()};function o(e){document.querySelectorAll(".focus").forEach(function(e){e.classList.remove("focus")}),e?(e.focus(),document.activeElement=a=e,e.parentElement.classList.add("focus")):document.activeElement.parentElement.classList.add("focus")}function l(){s=!1,n.innerHTML=t.value="",t.focus()}t.onkeyup=function(){if(i){const e=i.search(this.value.trim());if(e.length!==0){let t="";for(let n in e)t+=`<li class="post-entry"><header class="entry-header">${e[n].item.title}&nbsp;\xBB</header><a href="${e[n].item.permalink}" aria-label="${e[n].item.title}"></a></li>`;n.innerHTML=t,s=!0,r=n.firstChild,c=n.lastChild}else s=!1,n.innerHTML=""}},t.addEventListener("search",function(){this.value||l()}),document.onkeydown=function(e){let d=e.key;var u,i=document.activeElement;let h=document.getElementById("searchbox").contains(i);if(i===t)for(u=document.getElementsByClassName("focus");u.length>0;)u[0].classList.remove("focus");else a&&(i=a);if(d==="Escape")l();else if(!s||!h)return;else d==="ArrowDown"?(e.preventDefault(),i==t?o(n.firstChild.lastChild):i.parentElement!=c&&o(i.parentElement.nextSibling.lastChild)):d==="ArrowUp"?(e.preventDefault(),i.parentElement==r?o(t):i!=t&&o(i.parentElement.previousSibling.lastChild)):d==="ArrowRight"&&i.click()}})()