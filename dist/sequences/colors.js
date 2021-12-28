"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bgColorProcessStr = exports.colorProcessStr = exports.bgColorSeq = exports.colorSeq = void 0;
var sequences_1 = __importDefault(require("./sequences"));
// TODO add multiple levels of color
function stringLiterals() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args;
}
var colors = stringLiterals.apply(void 0, [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
]);
var mkColorSeq = function (offset) { return function (color) {
    if (color === void 0) { color = 'initial'; }
    if (color === 'initial')
        return { csi: true, str: offset + 9 + "m" };
    if (Array.isArray(color))
        return { csi: true, str: offset + 8 + ";2;" + color.join(';') + "m" };
    var colorIndex = colors.indexOf(color);
    return { csi: true, str: offset + colorIndex + "m" };
}; };
var colorSeq = mkColorSeq(30);
exports.colorSeq = colorSeq;
var bgColorSeq = mkColorSeq(40);
exports.bgColorSeq = bgColorSeq;
// https://stackoverflow.com/a/6969486
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var mkProcessStr = function (fn) { return function (text, color) {
    return text.split('\n').map(function (line) {
        var wantedColorSeq = fn(color);
        var end = fn();
        return ("" + wantedColorSeq + line.replaceAll(end, wantedColorSeq) + end)
            .replace(RegExp(escapeRegExp(end) + "(.*)" + escapeRegExp(end), 'g'), '$1');
    }).join('\n');
}; };
var colorProcessStr = mkProcessStr(function (color) { return sequences_1.default.escape(colorSeq(color)); });
exports.colorProcessStr = colorProcessStr;
var bgColorProcessStr = mkProcessStr(function (color) { return sequences_1.default.escape(bgColorSeq(color)); });
exports.bgColorProcessStr = bgColorProcessStr;
