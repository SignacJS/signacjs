interface SeqObj {
  csi?: boolean;
  str: string;
}

interface SeqArgs {
  in: NodeJS.ReadStream;
  out: NodeJS.WriteStream;
}

export default class Seq {
  static esc = '\x1b';
  static csi = Seq.esc + '[';
  in: NodeJS.ReadStream;
  out: NodeJS.WriteStream;

  constructor(options: Partial<SeqArgs>) {
    const fullOptions: SeqArgs = {
      in: process.stdin,
      out: process.stdout,
      ...options,
    };
    this.in = fullOptions.in;
    this.out = fullOptions.out;
  }

  static escape(e1: string[] | string | SeqObj, e2?: string) {
    if (typeof e1 === 'object'
      && !Array.isArray(e1)) {
      return `${e1.csi ? Seq.csi : Seq.esc}${e1.str}`
    }

    if (Array.isArray(e1)) return `${Seq.csi}${e1.join(';')}${e2 || ''}`;

    return `${Seq.esc}${e1}`
  }
  async get(e1: string[] | string, e2: string = '') {
    this.out.write(Seq.escape(e1, e2));
    return new Promise((r) => this.in.once('data', (data) => r(data)));
  }
};
