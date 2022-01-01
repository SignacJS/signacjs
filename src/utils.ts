import Cell, { CellLine, CellPlane, CellUnit } from "./abstract/Cell";
import { Element } from "./abstract/Element";

const pad3d = (
  arr: CellPlane,
  w: number,
  h: number,
  e: number = 0,
): CellPlane => {
  arr = arr.map((line: CellLine): CellLine => {
    return line.map((unit: CellUnit): CellUnit => {
      const numberOfLackingCells = Math.max(e - unit.length, 0);
      const lackingCells: CellUnit = new CellUnit(numberOfLackingCells);
      return CellUnit.from([...unit, ...lackingCells]);
    });
  });
  /*
    +-+-+-+
   / / / /|
  +-+-+-+ +
  |K|⎵|⎵|/|
  +-+-+-+ +
  |E|L|⎵|/|
  +-+-+-+ +
  |K|U|⎵|/|
  +-+-+-+ +
  |W|L|E|/
  +-+-+-+
  */
  arr = arr.map((line: CellLine): CellLine => {
    const numberOfLackingUnits = Math.max(w - line.length, 0);
    const lackingCells: CellLine = new CellLine(numberOfLackingUnits, 1);
    return CellLine.from([...line, ...lackingCells]);
  });
  /*
  line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  even bigger line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  extra mega giganticly enormous line + All level, ready to be concatenated
  bigger line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  how big even is this line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  */
  const numberOfLackingLines = Math.max(h - arr.length, 0);
  const lackingLines = new CellPlane(numberOfLackingLines, w, 1);
  arr = CellPlane.from([...arr, ...lackingLines]);
  /*
  +---+ \      
  |box| |      
  +---+ + maxY 
  ⎵⎵⎵⎵⎵ |      
  ⎵⎵⎵⎵⎵ /      
  */
  return arr;
};

const getColorOffset = (text: string) => text.length - text.length;

const merge = (
  axis: "X" | "Y" | "Z" = "X",
  ...cellPlaneArray: CellPlane[]
): CellPlane => {
  // TODO add options for flex and v align support
  if (axis === "Y") {
    const returnArr: CellPlane = cellPlaneArray.flat();
    const maxX = Math.max(...returnArr.map((line) => line.length));

    return CellPlane.from(
      returnArr.map((line) => {
        const numberOfLackingCells: number = maxX - line.length;
        const lackingCells: CellLine = new CellLine(numberOfLackingCells, 1);
        return [...line, ...lackingCells];
      })
    );
    // Not necessary but facilitates processing for later renderers
  } else if (axis === "X") {
    const maxY = Math.max(
      ...cellPlaneArray.map((cellPlane: CellPlane) => cellPlane.length)
    ); // get total height of result
    /*
    +---+ +-----------+ \
    |box| |           | |
    +---+ + other box | + maxY
          |           | |
          +-----------+ /
    */
    const rects = cellPlaneArray.map((cellPlane) => {
      const maxX = Math.max(
        ...cellPlane.map((cellLine: CellLine) => cellLine.length)
      ); // get total width of text
      /*
      line
      even bigger line
      extra mega giganticly enormous line
      bigger line
      how big even is this line
      \_________________________________/
                     maxX
      */
      return pad3d(cellPlane, maxX, maxY);
    });

    return CellPlane.from(
      rects.reduce((p: CellPlane, c: CellPlane) => {
        return p.map((line, idx) => [...line, ...c[idx]]);
      }, new CellPlane(maxY, 0, 0))
    );
  } else if (axis === "Z") {
    const maxY = Math.max(
      ...cellPlaneArray.map((cellPlane) => cellPlane.length)
    ); // get total height of result
    /*
    +---+ +-----------+ \
    |box| |           | |
    +---+ + other box | + maxY
          |           | |
          +-----------+ /
    */
    const maxZ = Math.max(
      ...cellPlaneArray.flat(2).map((cellUnit: CellUnit) => cellUnit.length)
    ); // get maxE elevation of text
    /*
      +-+
     / /|
    +-+ +-+   \
    |K|/ /|   |
    +-+-+ +   |
    |E|L|/|   |
    +-+-+ +-+ + maxZ
    |K|U|/ /| |
    +-+-+-+ + |
    |W|L|E|/  |
    +-+-+-+   /
    */
    const maxX = Math.max(
      ...cellPlaneArray.flat().map((cellLine: CellLine) => cellLine.length)
    ); // get max width of text
    /*
    line
    even bigger line
    extra mega giganticly enormous line
    bigger line
    how big even is this line
    \_________________________________/
                    maxX
    */
    const rects = cellPlaneArray.map((cellPlane) => {
      return pad3d(cellPlane, maxX, maxY, maxZ);
    });

    return rects.reduce((p: CellPlane, c: CellPlane) => {
      return CellPlane.from(
        p.map((cellLine: CellLine, yIdx: number) =>
          cellLine.map((cellUnit: CellUnit, xIdx: number) => [
            ...cellUnit,
            ...c[yIdx][xIdx],
          ])
        )
      );
    }, new CellPlane(maxY, maxX, maxZ));
  }
  throw new Error(`Axis ${axis} doesn't exist`);
};

export { merge, pad3d };
