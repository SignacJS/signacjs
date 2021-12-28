"use strict";
// I wished i didn't have to make a text node
// but JS's pass by reference only applies to objects..
Object.defineProperty(exports, "__esModule", { value: true });
// So here it is, the world's simplest text node
var TextNode = /** @class */ (function () {
    function TextNode(str) {
        this.str = str;
    }
    TextNode.prototype.toString = function () {
        return this.str;
    };
    TextNode.prototype.overwrite = function (to) {
        this.str = to;
        this.renderUp();
    };
    TextNode.prototype.renderUp = function () {
        if (!this.parent)
            throw new Error('Cannot render up if I have no parent');
        return this.parent.renderUp();
    };
    return TextNode;
}());
exports.default = TextNode;
