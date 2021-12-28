"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = require("./Element");
var chalk_1 = __importDefault(require("chalk"));
var TextNode_1 = __importDefault(require("./TextNode"));
describe('element', function () {
    describe('content', function () {
        it('should render plain text correctly', function () {
            expect((new Element_1.Element([
                new TextNode_1.default('Hello!')
            ])).render()).toBe('Hello!');
            expect((new Element_1.Element([
                new TextNode_1.default('Hello'),
                new TextNode_1.default('World!'),
            ])).render()).toBe('HelloWorld!');
            expect((new Element_1.Element([
                new TextNode_1.default('Hello'),
                new Element_1.Element([
                    new TextNode_1.default('World!'),
                ]),
            ])).render()).toBe('Hello \nWorld!');
        });
    });
    describe('backgroundColor', function () {
        it('should handle the background color correclty', function () {
            expect((new Element_1.Element([new TextNode_1.default(' ')], { style: { backgroundColor: 'white' } })).render())
                .toBe(chalk_1.default.bgWhite(' '));
            expect((new Element_1.Element([new TextNode_1.default('O hey!')], { style: { color: '#cccccc' } })).render())
                .toBe(chalk_1.default.hex('#cccccc')('O hey!')); // TODO add 16/256 color support
        });
    });
});
