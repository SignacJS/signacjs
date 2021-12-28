"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var ptal_1 = __importDefault(require("../ptal"));
var renderer_1 = __importDefault(require("./renderer"));
var react_1 = require("react");
function App() {
    var _a = (0, react_1.useState)(0), seconds = _a[0], setSeconds = _a[1];
    (0, react_1.useEffect)(function () {
        var secondsInterval = setInterval(function () { return setSeconds(seconds + 1); }, 1000);
        return function () { return clearInterval(secondsInterval); };
    });
    return (0, jsx_runtime_1.jsxs)("div", { children: ["Hello world ", seconds] }, void 0);
}
renderer_1.default.render((0, jsx_runtime_1.jsx)(App, {}, void 0), new ptal_1.default());
