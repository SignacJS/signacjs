"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var allpipes_1 = require("./allpipes");
var Pipe = /** @class */ (function () {
    function Pipe(pipeSettings) {
        if (pipeSettings === void 0) { pipeSettings = { orientation: {} }; }
        this.configuration = pipeSettings;
    }
    Pipe.calcPipeCharacter = function (config) {
        var ltrbSorted = [];
        var ltrbSortedArg = [];
        for (var _i = 0, _a = ['LEFT', 'TOP', 'RIGHT', 'BOTTOM']; _i < _a.length; _i++) {
            var O = _a[_i];
            var orientationCfg = config.orientation[O.toLowerCase()];
            if (orientationCfg) {
                ltrbSorted.push(O);
                ltrbSortedArg.push(O);
                if (typeof orientationCfg === 'string')
                    ltrbSortedArg.push(orientationCfg.toUpperCase());
            }
        }
        return allpipes_1.allPipes[ltrbSortedArg.join('_')];
    };
    Object.defineProperty(Pipe.prototype, "pipeCharacter", {
        get: function () {
            return Pipe.calcPipeCharacter(this.configuration);
        },
        enumerable: false,
        configurable: true
    });
    return Pipe;
}());
exports.default = Pipe;
