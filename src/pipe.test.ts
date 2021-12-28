import Pipe from './pipe';

describe('Pipes', function () {
  describe('get pipeCharacter', function () {
    it('should return the correct character', function () {
      expect((new Pipe({ orientation: { top: true, bottom: true } })).pipeCharacter).toBe('│');
      expect((new Pipe({ orientation: { left: true, top: true } })).pipeCharacter).toBe('┘');
      expect((new Pipe({ orientation: { left: true, top: 'bold' } })).pipeCharacter).toBe('┚');
      expect((new Pipe({ orientation: { left: 'bold', top: 'bold' } })).pipeCharacter).toBe('┛');
      expect((new Pipe({ orientation: { right: true, left: true, top: true } })).pipeCharacter).toBe('┴');
    });
  });
});
