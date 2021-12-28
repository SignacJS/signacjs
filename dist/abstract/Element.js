"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
var utils_1 = require("../utils");
var colors_1 = require("../sequences/colors");
var TextNode_1 = __importDefault(require("./TextNode"));
var Element = /** @class */ (function () {
    function Element(content, props) {
        if (props === void 0) { props = { style: {} }; }
        this.context = {};
        this.toString = this.render;
        this.forceUpdate = this.renderUp;
        var currentElement = this;
        var fullProps = __assign({ style: {} }, props);
        this.props = fullProps;
        this.styling = fullProps.style;
        this.content = content;
        this.style = new Proxy(Element.defaultStyling, {
            get: function (obj, prop) {
                var style = currentElement.styling[prop];
                if (style === 'unset') {
                    if (currentElement.parent && Element.inheritedStyling.includes(prop)) {
                        return currentElement.parent.style[prop]; // wee down the proxy hole
                    }
                    return obj[prop];
                }
                if (style === 'inherit') {
                    if (currentElement.parent) {
                        return currentElement.parent.style[prop]; // wee down the proxy hole
                    }
                    return obj[prop];
                }
                if (style === 'initial')
                    return obj[prop];
                return style || obj[prop];
            },
            set: function (obj, prop, value) {
                fullProps.style[prop] = value === 'initial' ? null : value;
                return true;
            }
        });
    }
    Element.prototype.render = function () {
        var _this = this;
        return Element.renderers.reduce(function (p, f) { return f(p, _this); }, '');
    };
    Element.prototype.renderUp = function () {
        if (!this.parent)
            throw new Error('Cannot render up if I have no parent');
        return this.parent.renderUp();
    };
    Element.prototype.append = function (element) {
        this.content.push(element);
        element.parent = this;
    };
    Element.prototype.insertBefore = function (node, beforeNode) {
        this.content.splice(this.content.indexOf(beforeNode), 0, node);
        node.parent = this;
    };
    Element.prototype.remove = function (node) {
        this.content.splice(this.content.indexOf(node), 1);
        node.parent = undefined;
    };
    Element.renderers = [
        function (previousRender, el) {
            var str = [];
            var content = el.content;
            for (var i = 0; i < content.length; i++) {
                var prevNode = content[i - 1];
                var currNode = content[i];
                if (currNode instanceof TextNode_1.default)
                    currNode.str = (0, colors_1.colorProcessStr)(currNode.str, (0, utils_1.parseColor)(el.style.color));
                if (!prevNode) {
                    str.push(currNode.toString());
                    continue;
                }
                var nodeIsInline = function (Node) { return Node instanceof TextNode_1.default || Node.style.display.startsWith('inline'); };
                if (nodeIsInline(prevNode) && nodeIsInline(currNode)) {
                    str[str.length - 1] = (0, utils_1.merge)('X', str[str.length - 1], content[i].toString());
                    continue;
                }
                str.push(currNode.toString());
            }
            return utils_1.merge.apply(void 0, __spreadArray(['Y'], str, false));
        },
        function (previousRender, el) {
            var _a;
            var width;
            if (el.style.width === 'content')
                width = ((_a = previousRender[0]) === null || _a === void 0 ? void 0 : _a.length) || 0;
            var height = el.style.height;
            return (0, utils_1.pad2d)(previousRender, el.style.width, el.style.height);
        },
        function (previousRender, el) {
            var bgColor = (0, utils_1.parseColor)(el.style.backgroundColor);
            return (0, colors_1.bgColorProcessStr)(previousRender, bgColor);
        },
    ];
    Element.defaultStyling = {
        display: 'block',
        color: 'initial',
        backgroundColor: 'initial',
        width: 'content',
        height: 'content',
        margin: 0,
        padding: 0,
        border: 'none',
        resize: 'none',
        position: 'static',
    };
    Element.inheritedStyling = [
        'color',
    ];
    return Element;
}());
exports.Element = Element;
