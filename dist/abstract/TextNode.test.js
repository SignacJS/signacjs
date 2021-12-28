"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TextNode_1 = __importDefault(require("./TextNode"));
describe('the world\'s simplest text node', function () {
    it('stores text', function () {
        expect((new TextNode_1.default('woah, a text node')).str).toBe('woah, a text node');
    });
    it('is passed by reference', function () {
        var endMyPain = new TextNode_1.default('the');
        var fakeContents = [
            new TextNode_1.default('the'),
            new TextNode_1.default('quick'),
            new TextNode_1.default('brown'),
            new TextNode_1.default('fox'),
            new TextNode_1.default('jumps'),
            new TextNode_1.default('over'),
            endMyPain,
            new TextNode_1.default('lazy'),
            new TextNode_1.default('dog'),
        ];
        var fakeContentsButEveryoneIsHappy = [
            new TextNode_1.default('the'),
            new TextNode_1.default('quick'),
            new TextNode_1.default('brown'),
            new TextNode_1.default('fox'),
            new TextNode_1.default('jumps'),
            new TextNode_1.default('over'),
            new TextNode_1.default('lazy'),
            new TextNode_1.default('dog'),
        ];
        fakeContents.splice(fakeContents.indexOf(endMyPain), 1);
        expect(fakeContents).toEqual(fakeContentsButEveryoneIsHappy);
    });
});
