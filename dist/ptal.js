"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = require("./abstract/Element");
var TextNode_1 = __importDefault(require("./abstract/TextNode"));
var termctl_1 = require("./sequences/termctl");
var sequences_1 = __importDefault(require("./sequences/sequences"));
var PTAL = /** @class */ (function (_super) {
    __extends(PTAL, _super);
    function PTAL(options, content, props) {
        if (options === void 0) { options = {}; }
        if (content === void 0) { content = [new TextNode_1.default('')]; }
        if (props === void 0) { props = { style: {} }; }
        var _this = _super.call(this, content, props) || this;
        var fullOptions = __assign({ width: process.stdout.columns, height: process.stdout.rows, adaptToTerm: true, switchToAlternate: true, in: process.stdin, out: process.stdout }, options);
        _this.width = fullOptions.width;
        _this.height = fullOptions.height;
        _this.adaptToTerm = fullOptions.adaptToTerm;
        _this.in = fullOptions.in;
        _this.out = fullOptions.out;
        _this.out.write(sequences_1.default.escape(termctl_1.switchToAlternate));
        _this.Seq = new sequences_1.default({ in: _this.in, out: _this.out });
        var done = false;
        function exitHandler() {
            if (!done) {
                fullOptions.out.write(sequences_1.default.escape(termctl_1.switchToNormal) + "\n");
                done = true;
            }
            return process.exit(process.exitCode);
        }
        // do something when app is closing
        process.once('exit', exitHandler);
        // catches ctrl+c event
        process.on('SIGINT', exitHandler);
        // catches uncaught exceptions
        process.on('uncaughtException', exitHandler);
        return _this;
    }
    PTAL.prototype.renderUp = function () {
        return this.render();
    };
    PTAL.prototype.render = function () {
        this.out.write(sequences_1.default.escape(termctl_1.clearScreen));
        var rendered = _super.prototype.render.call(this);
        this.out.write(rendered);
        return rendered;
    };
    return PTAL;
}(Element_1.Element));
exports.default = PTAL;
