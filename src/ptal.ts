import { Element, ElementProps } from "./abstract/Element";
import TextNode from "./abstract/TextNode";
import {
  clearScreen,
  switchToAlternate,
  switchToNormal,
} from "./sequences/termctl";
import Seq from "./sequences/sequences";
import { CellLine, CellPlane, CellUnit } from "./abstract/Cell";

export interface PTALOptions {
  width: number;
  height: number;
  adaptToTerm: boolean;
  switchToAlternate: boolean;
  in: NodeJS.ReadStream;
  out: NodeJS.WriteStream;
}

export default class PTAL extends Element {
  _width: number;
  _height: number;
  adaptToTerm: boolean;
  in: NodeJS.ReadStream;
  out: NodeJS.WriteStream;
  Seq: Seq;
  constructor(
    options: Partial<PTALOptions> = {},
    content: (Element | TextNode)[] = [new TextNode("")],
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
    this._width = fullOptions.width;
    this._height = fullOptions.height;
    this.style.width = fullOptions.width;
    this.style.height = fullOptions.height;
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
    process.once("exit", exitHandler);

    // catches ctrl+c event
    process.on("SIGINT", exitHandler);

    // catches uncaught exceptions
    process.on("uncaughtException", (err) => console.error(err));
    process.on("uncaughtException", exitHandler);
  }
  renderUp(): CellPlane {
    return this.render();
  }
  render(): CellPlane {
    const rendered = super.render();
    debugger;
    const renderedStr = rendered
      .map((cellLine: CellLine) => {
        return cellLine
          .map((cellUnit: CellUnit) => {
            return cellUnit.render();
          })
          .join("");
      })
      .join("\n");

    this.out.write(renderedStr);

    return rendered;
  }
  get viewportWidth(): number {
    return this.width;
  }
  get viewportHeight(): number {
    return this.height;
  }

  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }

  set width(val) {
    this._width = val;
  }
  set height(val) {
    this._height = val;
  }
}
