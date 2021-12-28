import { Orientation, PipeConfig } from './types';
import { allPipes } from './allpipes';

class Pipe {
  configuration: PipeConfig;
  constructor (pipeSettings: PipeConfig = { orientation: {} }) {
    this.configuration = pipeSettings;
  }

  static calcPipeCharacter (config: PipeConfig) {
    const ltrbSorted = [];
    const ltrbSortedArg = [];

    for (let O of ['LEFT', 'TOP', 'RIGHT', 'BOTTOM']) {
      const orientationCfg = config.orientation[O.toLowerCase() as Orientation];
      if (orientationCfg) {
        ltrbSorted.push(O);

        ltrbSortedArg.push(O);
        if (typeof orientationCfg === 'string') ltrbSortedArg.push(orientationCfg.toUpperCase());
      }
    }
    return allPipes[(ltrbSortedArg.join('_') as keyof typeof allPipes)];
  }

  get pipeCharacter () {
    return Pipe.calcPipeCharacter(this.configuration);
  }
}

export default Pipe;
