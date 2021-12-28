"use strict";
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
exports.pad2d = exports.parseColor = exports.merge = void 0;
var strip_ansi_1 = __importDefault(require("strip-ansi"));
var pad2d = function (str, w, h) {
    var arr = typeof str === 'string' ? str.split('\n') : str;
    arr = arr.map(function (line) { return line.padEnd(w, ' '); });
    /*
    line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
    even bigger line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
    extra mega giganticly enormous line + All level, ready to be concatenated
    bigger line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
    how big even is this line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
    */
    arr = __spreadArray(__spreadArray([], arr, true), Array(h).fill(' '.repeat(h)), true);
    /*
    +---+ \
    |box| |
    +---+ + maxY
    ⎵⎵⎵⎵⎵ |
    ⎵⎵⎵⎵⎵ /
    */
    return arr.join('\n');
};
exports.pad2d = pad2d;
var getColorOffset = function (text) { return text.length - (0, strip_ansi_1.default)(text).length; };
var merge = function (axis) {
    if (axis === void 0) { axis = 'X'; }
    var texts = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        texts[_i - 1] = arguments[_i];
    }
    if (axis === 'X') {
        var maxY_1 = Math.max.apply(Math, texts.map(function (text) { return text.split('\n').length; })); // get total height of result
        /*
        +---+-----------+ \
        |box|           | |
        +---+ other box | + maxY
            |           | |
            +-----------+ /
        */
        var rects = texts.map(function (text) {
            var arr = text.split('\n');
            var maxX = Math.max.apply(Math, arr.map(function (line) { return (0, strip_ansi_1.default)(line).length; })); // get total width of text
            /*
            line
            even bigger line
            extra mega giganticly enormous line
            bigger line
            how big even is this line
            \_________________________________/
                           maxX
            */
            arr = pad2d(arr, maxX, maxY_1).split('\n');
            return arr.join('\n');
        });
        return rects.reduce(function (p, c) {
            var arr = c.split('\n');
            return p.map(function (line, idx) { return line + arr[idx]; });
        }, Array(maxY_1).fill('')).join('\n');
    }
    else if (axis === 'Y') {
        var returnArr = texts.join('\n').split('\n');
        var maxX_1 = Math.max.apply(Math, returnArr.map(function (line) { return (0, strip_ansi_1.default)(line).length; }));
        return returnArr
            .map(function (line) { return line
            .padEnd(maxX_1 + getColorOffset(line), ' '); })
            .join('\n');
        // Not necessary but facilitates processing for later renderers
    }
    throw new Error("Axis " + axis + " doesn't exist");
};
exports.merge = merge;
var parseColor = function (hex) {
    if (typeof hex !== 'string')
        return hex;
    var hexData = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!hexData)
        return hex;
    var r = parseInt(hexData[1], 16);
    var g = parseInt(hexData[2], 16);
    var b = parseInt(hexData[3], 16);
    return [r, g, b];
};
exports.parseColor = parseColor;
var convertSizes = ;
