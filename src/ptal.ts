import { Element, ElementProps } from './abstract/Element';
import TextNode from './abstract/TextNode';
import { clearScreen, switchToAlternate, switchToNormal } from './sequences/termctl';
import Seq from './sequences/sequences';

export interface PTALOptions {
  width: number;
  height: number;
  adaptToTerm: boolean;
  switchToAlternate: boolean;
  in: NodeJS.ReadStream;
  out: NodeJS.WriteStream;
}

export default class PTAL extends Element {
  width: number;
  height: number;
  adaptToTerm: boolean;
  in: NodeJS.ReadStream;
  out: NodeJS.WriteStream;
  Seq: Seq;
  constructor (
    options: Partial<PTALOptions> = {},
    content: (Element | TextNode)[] = [new TextNode('')],
    props: ElementProps = { style: {} }
  ) {
    super(content, props);
    let fullOptions: PTALOptions = {
      width: process.stdout.columns,
      height: process.stdout.rows,
      adaptToTerm: true,
      switchToAlternate: true,
      in: process.stdin,
      out: process.stdout,
      ...options,
    };
    this.width = fullOptions.width;
    this.height = fullOptions.height;
    this.adaptToTerm = fullOptions.adaptToTerm;
    this.in = fullOptions.in;
    this.out = fullOptions.out;
    this.out.write(Seq.escape(switchToAlternate));
    this.Seq = new Seq({ in: this.in, out: this.out });

    let done = false;
    function exitHandler() {
      if (!done) {
        fullOptions.out.write(`${Seq.escape(switchToNormal)}\n`);
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
  }
  renderUp(): string {
    return this.render();
  }
  render(): string {
    this.out.write(Seq.escape(clearScreen));
    const rendered = super.render();
    this.out.write(rendered);

    return rendered;
  }
  get viewportWidth() {
    return this.width;
  }
  get viewportHeight() {
    return this.height;
  }
}
