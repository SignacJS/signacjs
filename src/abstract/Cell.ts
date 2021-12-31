import { color as blend } from "color-blend";
import { bgColorProcessStr } from "../sequences/colors";
import { color } from "../styles/types";

// Generate a cell class capable of storing a character, as well as other metadata

export interface Attributes {
  backgroundColor: color;
}

export default class Cell {
  char: string | null;
  attributes: Partial<Attributes> = {};
  parent?: Element;
  constructor(char: string | null = null, parent?: Element) {
    if (char && char.length > 1)
      throw new Error("Cells are only supposed to hold 1 character");
    this.char = char;
    this.parent = parent;
  }
  isTransparent() {
    if (this.attributes.backgroundColor) return false;
    if (this.char !== null) return false;
    return true;
  }
}

export class CellUnit extends Array<Cell> {
  constructor(Zext: number) {
    super(Zext);
    for (let i = 0; i < Zext; i++) {
      this[i] = new Cell();
    }
  }
  calculateBackgroundColor() {}
  render() {
    const text = this.reverse().find((cell) => !cell.isTransparent());
    return bgColorProcessStr(
      text?.char || " ",
      text?.attributes.backgroundColor || "initial"
    );
  }
  static from(cellUnitWannabe: Cell[]) {
    let cellUnit = new CellUnit(cellUnitWannabe.length);
    cellUnitWannabe.forEach((value, index) => {
      cellUnit[index] = value;
    });
    return cellUnit;
  }
}
export class CellLine extends Array<CellUnit> {
  constructor(Xext: number, Zext: number) {
    super(Xext);
    for (let i = 0; i < Xext; i++) {
      this[i] = new CellUnit(Zext);
    }
  }
  static from(cellLineWannabe: Cell[][]) {
    let unitsLength = cellLineWannabe.map((v) => v.length);
    let cellLine = new CellLine(
      cellLineWannabe.length,
      Math.max(...unitsLength)
    );
    cellLineWannabe.forEach((value, index) => {
      cellLine[index] = CellUnit.from(value);
    });
    return cellLine;
  }
}
export class CellPlane extends Array<CellLine> {
  constructor(Yext: number, Xext: number, Zext: number) {
    super(Yext);
    for (let i = 0; i < Yext; i++) {
      this[i] = new CellLine(Xext, Zext);
    }
  }
  static from(cellPlaneWannabe: Cell[][][]) {
    let unitsLength = cellPlaneWannabe.flat(1).map((v) => v.length);
    let linesLength = cellPlaneWannabe.map((v) => v.length);
    let cellPlane = new CellPlane(
      cellPlaneWannabe.length,
      Math.max(...linesLength),
      Math.max(...unitsLength)
    );
    cellPlaneWannabe.forEach((value, index) => {
      cellPlane[index] = CellLine.from(value);
    });
    return cellPlane;
  }
}
