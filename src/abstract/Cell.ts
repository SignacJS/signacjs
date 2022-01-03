import { color as blend } from "color-blend";
import { bgColorProcessStr } from "../sequences/colors";
import { color } from "../styles/types";

import { Element } from "./Element";
import TextNode from "./TextNode";

export interface Attributes {
  backgroundColor: color;
}

export default class Cell {
  char: string | null;
  parent?: Element | TextNode;
  constructor(char: string | null = null, parent?: Element | TextNode) {
    if (char && char.length > 1)
      throw new Error("Cells are only supposed to hold 1 character");
    this.char = char;
    this.parent = parent;
  }
  isTransparent() {
    if (this.parent?.style?.backgroundColor) return false;
    if (this.char !== null) return false;
    return true;
  }
}

export class CellUnit extends Array<Cell> {
  constructor(Zext: number = 0, parent?: Element | TextNode) {
    super(Zext);
    for (let i = 0; i < Zext; i++) {
      this[i] = new Cell(null, parent);
    }
  }
  calculateBackgroundColor() {}
  render() {
    const reversedArr = [...this].reverse();
    const text = reversedArr.find((cell) => !cell.isTransparent());
    const hasBgColor = reversedArr.find(
      (cell) =>
        cell.parent?.style?.backgroundColor !== "transparent" &&
        cell.parent?.style?.backgroundColor !== undefined
    );
    return bgColorProcessStr(
      text?.char || " ",
      hasBgColor?.parent?.style?.backgroundColor || "initial"
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
  constructor(Xext: number = 0, Zext: number = 0, parent?: Element | TextNode) {
    super(Xext);
    for (let i = 0; i < Xext; i++) {
      this[i] = new CellUnit(Zext, parent);
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
  constructor(Yext: number = 0, Xext: number = 0, Zext: number = 0, parent?: Element | TextNode) {
    super(Yext);
    for (let i = 0; i < Yext; i++) {
      this[i] = new CellLine(Xext, Zext, parent);
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
