"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_1 = __importDefault(require("./pipe"));
describe('Pipes', function () {
    describe('get pipeCharacter', function () {
        it('should return the correct character', function () {
            expect((new pipe_1.default({ orientation: { top: true, bottom: true } })).pipeCharacter).toBe('│');
            expect((new pipe_1.default({ orientation: { left: true, top: true } })).pipeCharacter).toBe('┘');
            expect((new pipe_1.default({ orientation: { left: true, top: 'bold' } })).pipeCharacter).toBe('┚');
            expect((new pipe_1.default({ orientation: { left: 'bold', top: 'bold' } })).pipeCharacter).toBe('┛');
            expect((new pipe_1.default({ orientation: { right: true, left: true, top: true } })).pipeCharacter).toBe('┴');
        });
    });
});
